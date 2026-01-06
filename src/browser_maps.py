
import asyncio
from playwright.async_api import async_playwright
import sys
import json
import os
import uuid

# Directory for saving videos
VIDEOS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "videos")
os.makedirs(VIDEOS_DIR, exist_ok=True)

async def verify_google_maps_address(address: str):
    video_filename = f"{uuid.uuid4()}.webm"
    video_path = os.path.join(VIDEOS_DIR, video_filename)

    async with async_playwright() as p:
        # Launch browser with video recording enabled
        browser = await p.chromium.launch(headless=False) # Headless=False for visual demo if needed, but works in headless too
        context = await browser.new_context(
            record_video_dir=VIDEOS_DIR,
            record_video_size={"width": 1280, "height": 720},
            viewport={"width": 1280, "height": 720}
        )
        page = await context.new_page()

        try:
            # Navigate to Google Maps
            await page.goto("https://www.google.com/maps?hl=en", timeout=60000)

            # Wait for search box
            await page.wait_for_selector("#searchboxinput", timeout=10000)
            
            # Type address
            await page.fill("#searchboxinput", address)
            await page.press("#searchboxinput", "Enter")

            # Wait for search results or direct location
            # If successful, URL usually changes to include coordinates or place name
            # Or a specific "headline" element appears. 
            # We'll wait a bit for network idle or changes.
            await page.wait_for_load_state("networkidle")
            
            await asyncio.sleep(5) # Give it time to animate/move map

            current_url = page.url
            
            # Simple heuristic: verification success if URL contains "place" or coordinates "@"
            # And we don't see "Google Maps can't find" text
            
            not_found = await page.query_selector("text='Google Maps can\\'t find'")
            if not_found:
                verified = False
            else:
                # If we are on a /place/ URL or generic map with coordinates, assume success for now
                verified = True

            # Close context to save video
            await context.close()
            await browser.close()
            
            # Video is saved with a random name by Playwright, need to find it and rename it to our UUID/Target name
            # Actually, context.new_page() inside new_context(record_video_dir=...) saves the video.
            # We need to identify *which* file it is. 
            # Since we just ran it, it should be the most recent one or we can capture page.video.path() before closing?
            
            # Wait, page.video.path() is available *before* closing context?
            # actually page.video.path() execution is needed before closing but after it started.
            # But the file is only fully written after close. 
            # Re-opening logic to capture path correctly.
            
        except Exception as e:
            await context.close()
            await browser.close()
            return {"error": str(e), "verified": False}

    # Playwright generates random names like 'e2fa...webm'. 
    # Since we set record_video_dir, we can't easily dictate the exact filename upfront easily via API 
    # effectively without `page.video`.
    # Let's rewrite the logic slightly to capturing `page.video.path()`
    return {"verified": verified, "map_url": current_url}

# Revised implementation with correct video path capture
async def verify_address_optimized(address: str):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            record_video_dir=VIDEOS_DIR,
            record_video_size={"width": 1280, "height": 720},
            viewport={"width": 1280, "height": 720}
        )
        page = await context.new_page()
        
        verified = False
        map_url = ""
        saved_video_path = ""

        try:
            print(f"Navigating to Google Maps for: {address}")
            await page.goto("https://www.maps.google.com", timeout=60000)
            
            # Handle potential cookie consent if it appears (unlikely in headless sometimes, but good practice)
            # await page.click("text='Accept all'", timeout=2000) 

            await page.wait_for_selector("#searchboxinput", state="visible")
            await page.fill("#searchboxinput", address)
            await page.keyboard.press("Enter")
            
            # Wait for meaningful change. 
            # Cases: 
            # 1. Direct hit: URL changes to /maps/place/...
            # 2. List of results: Panel shows list.
            # 3. Not found: Text "Google Maps can't find..."
            
            # Wait for either the "Not Found" message OR the "Place" header OR a URL update
            # We'll wait a few seconds for stability
            await asyncio.sleep(5) 
            
            content = await page.content()
            
            if "Google Maps can't find" in content:
                print("Address not found.")
                verified = False
            else:
                # Assume found if no error message
                print("Address found!")
                verified = True
                map_url = page.url

            # Capture video path before closing
            video_obj = page.video
            if video_obj:
                saved_video_path = await video_obj.path()

        except Exception as e:
            print(f"Error during verification: {e}")
            verified = False
        finally:
            await context.close()
            await browser.close()

    return {
        "verified": verified,
        "map_url": map_url,
        "video_path": saved_video_path
    }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        addr = sys.argv[1]
        result = asyncio.run(verify_address_optimized(addr))
        print(json.dumps(result))
    else:
        print(json.dumps({"error": "No address provided"}))
