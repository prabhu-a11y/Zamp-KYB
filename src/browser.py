import asyncio
import json
import random
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
from datetime import datetime

async def extract_license_info(trade_license_number: str = None, direct_url: str = None):
    """
    Extract license information from Dubai invest portal with maximum stealth
    
    Args:
        trade_license_number: The trade license number to search for
        direct_url: Optional direct URL to navigate to (e.g. from QR code)
        
    Returns:
        dict: Extracted license information
    """
    
    async with async_playwright() as p:
        # Try Firefox as it's sometimes harder to detect
        browser = await p.firefox.launch(
            headless=True,
            firefox_user_prefs={
                "dom.webdriver.enabled": False,
                "useAutomationExtension": False,
                "general.platform.override": "Win32",
                "general.useragent.override": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0"
            }
        )
        
        # Create context with realistic settings
        context = await browser.new_context(
            viewport={"width": 1366, "height": 768},  # Common laptop resolution
            locale="en-US",
            timezone_id="Asia/Dubai",  # Use Dubai timezone
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
            record_video_dir="videos/",
            record_video_size={"width": 1366, "height": 768},
            geolocation={"latitude": 25.2048, "longitude": 55.2708},
            permissions=["geolocation"],
            extra_http_headers={
                "Accept-Language": "en-US,en;q=0.9,ar;q=0.8",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Encoding": "gzip, deflate, br",
                "DNT": "1",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "none",
                "Cache-Control": "max-age=0"
            }
        )
        
        page = await context.new_page()
        
        try:
            target_url = ""
            if direct_url:
                print(f"Using Direct QR URL: {direct_url}")
                target_url = direct_url
            else:
                print(f"Directing to Trade License URL: {trade_license_number}")
                # Construct Direct URL
                target_url = f"https://app.invest.dubai.ae/dul/dul-{trade_license_number}?bk=1"
            
            # Navigate directly
            print(f"Navigating to: {target_url}")
            await page.goto(target_url, wait_until="load", timeout=60000)
            
            # Wait for details page to confirm load
            print("Waiting for page content to load...")
            # Wait for a key element that signifies the details are present
            try:
                await page.wait_for_selector("text=Business Name", timeout=30000)
            except PlaywrightTimeoutError:
                print("Warning: 'Business Name' not found immediately, page might be slow or invalid ID.")
            
            # Small random pause for realism/loading
            await asyncio.sleep(random.uniform(2.0, 4.0))
            
            # Scroll to simulate reading
            await page.mouse.wheel(0, random.randint(100, 200))
            await asyncio.sleep(random.uniform(1.0, 1.5))
            
            
            # Extract license information
            print("Extracting license information...")
            
            license_data = {}
            
            # Extract Business Name
            try:
                # Selector provided by user
                business_name_selector = "#printArea > div.border-sm.border-grey-300.border-opacity-100.mt-6.rounded-lg > div.v-card.v-card--flat.v-theme--omnia.v-card--density-default.rounded-md.v-card--variant-elevated.border-0.rounded-lg > div:nth-child(5) > div > div > div.v-col.v-col-6.text-right.text-body-1.font-weight-semibold.text-grey-900"
                business_name_element = await page.wait_for_selector(business_name_selector, timeout=5000)
                if business_name_element:
                    license_data["Business Name"] = await business_name_element.text_content()
                    license_data["Business Name"] = license_data["Business Name"].strip()
            except Exception as e:
                print(f"Error extracting Business Name: {e}")
                license_data["Business Name"] = None
            
            # Extract License Number
            try:
                # Selector provided by user
                license_number_selector = "#printArea > div.border-sm.border-grey-300.border-opacity-100.mt-6.rounded-lg > div.v-card.v-card--flat.v-theme--omnia.v-card--density-default.rounded-md.v-card--variant-elevated.border-0.rounded-lg > div:nth-child(4) > div > div > div.v-col.v-col-6.text-right.text-body-1.font-weight-semibold.text-grey-900"
                license_number_element = await page.wait_for_selector(license_number_selector, timeout=5000)
                if license_number_element:
                    license_data["License Number"] = await license_number_element.text_content()
                    license_data["License Number"] = license_data["License Number"].strip()
            except Exception as e:
                print(f"Error extracting License Number: {e}")
                license_data["License Number"] = None
            
            # Extract Issuing Authority
            try:
                # Selector provided by user
                issuing_authority_selector = "#printArea > div.border-sm.border-grey-300.border-opacity-100.mt-6.rounded-lg > div.v-card.v-card--flat.v-theme--omnia.v-card--density-default.rounded-md.v-card--variant-elevated.border-0.rounded-lg > div:nth-child(7) > div > div > div.v-col.v-col-6.text-right.text-body-1.font-weight-semibold.text-grey-900"
                issuing_authority_element = await page.wait_for_selector(issuing_authority_selector, timeout=5000)
                if issuing_authority_element:
                    license_data["Issuing Authority"] = await issuing_authority_element.text_content()
                    license_data["Issuing Authority"] = license_data["Issuing Authority"].strip()
            except Exception as e:
                print(f"Error extracting Issuing Authority: {e}")
                license_data["Issuing Authority"] = None
            
            # Extract Legal Type
            try:
                # Selector provided by user
                legal_type_selector = "#printArea > div.border-sm.border-grey-300.border-opacity-100.mt-6.rounded-lg > div.v-card.v-card--flat.v-theme--omnia.v-card--density-default.rounded-md.v-card--variant-elevated.border-0.rounded-lg > div:nth-child(8) > div > div > div.v-col.v-col-6.text-right.text-body-1.font-weight-semibold.text-grey-900"
                legal_type_element = await page.wait_for_selector(legal_type_selector, timeout=5000)
                if legal_type_element:
                    license_data["Legal Type"] = await legal_type_element.text_content()
                    license_data["Legal Type"] = license_data["Legal Type"].strip()
            except Exception as e:
                print(f"Error extracting Legal Type: {e}")
                license_data["Legal Type"] = None
            
            # Extract Activities (Unchanged as per request)
            try:
                await page.locator("text=License Activities").scroll_into_view_if_needed()
                await asyncio.sleep(random.uniform(0.8, 1.5))
                
                activities = []
                activity_elements = await page.locator("text=License Activities").locator("..").locator("..").locator("text=/^[A-Za-z].*Active$/").all()
                
                for activity_element in activity_elements:
                    activity_text = await activity_element.text_content()
                    activity_name = activity_text.replace("Active", "").strip()
                    if activity_name:
                        activities.append(activity_name)
                
                license_data["Activities"] = activities if activities else None
            except Exception as e:
                print(f"Error extracting Activities: {e}")
                license_data["Activities"] = None
            
            # Extract Expiry Date
            try:
                # Selector provided by user
                expiry_date_selector = "#printArea > div.border-sm.border-grey-300.border-opacity-100.mt-6.rounded-lg > div.v-card.v-card--flat.v-theme--omnia.v-card--density-default.rounded-md.v-card--variant-elevated.border-0.rounded-lg > div:nth-child(3) > div > div > div.v-col.v-col-6.text-right.text-body-1.font-weight-semibold.text-grey-900"
                expiry_date_element = await page.wait_for_selector(expiry_date_selector, timeout=5000)
                if expiry_date_element:
                    license_data["Expiry Date"] = await expiry_date_element.text_content()
                    license_data["Expiry Date"] = license_data["Expiry Date"].strip()
            except Exception as e:
                print(f"Error extracting Expiry Date: {e}")
                license_data["Expiry Date"] = None
            
            print("\n" + "="*50)
            print("EXTRACTED LICENSE INFORMATION")
            print("="*50)
            print(json.dumps(license_data, indent=2, ensure_ascii=False))
            # Close context to save video
            await context.close()
            
            # Get video path
            video_path = await page.video.path()
            if video_path:
                print(f"Video saved at: {video_path}")
                license_data["video_path"] = video_path
            
            return license_data
            
        except PlaywrightTimeoutError as e:
            print(f"Timeout error: {e}")
            await page.screenshot(path="debug_timeout.png", full_page=True)
            error_data = {"error": "Timeout waiting for element"}
            # Ensure video is saved even on timeout
            await context.close()
            video_path = await page.video.path()
            if video_path:
                error_data["video_path"] = video_path
            return error_data
        except Exception as e:
            print(f"Error occurred: {e}")
            await page.screenshot(path="debug_error.png", full_page=True)
            error_data = {"error": str(e)}
            await context.close()
            video_path = await page.video.path()
            if video_path:
                error_data["video_path"] = video_path
            return error_data
        finally:
            await browser.close()
            
            video_path = await page.video.path() if page.video else None
            if video_path:
                print(f"\nVideo saved to: {video_path}")

# Main execution
async def main():
    trade_license_number = "1234538"
    
    result = await extract_license_info(trade_license_number)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = f"license_data_{trade_license_number}_{timestamp}.json"
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    print(f"Results saved to: {output_file}")

if __name__ == "__main__":
    asyncio.run(main())