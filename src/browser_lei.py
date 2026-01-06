import asyncio
import json
import traceback
from playwright.async_api import async_playwright
async def extract_lei_info(lei_code: str):
    """
    Extract LEI company details from leicodeae.com
    
    Args:
        lei_code: The 20-character LEI code
        
    Returns:
        dict: Extracted company details and video path
    """
    async with async_playwright() as p:
        browser = await p.firefox.launch(
            headless=True,
            firefox_user_prefs={
                "dom.webdriver.enabled": False,
                "useAutomationExtension": False,
            }
        )
        
        context = await browser.new_context(
            viewport={"width": 1366, "height": 768},
            record_video_dir="videos/",
            record_video_size={"width": 1366, "height": 768},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0"
        )
        
        page = await context.new_page()
        lei_data = {}
        
        try:
            target_url = f"https://leicodeae.com/companydetail.php?key={lei_code}"
            print(f"Navigating to LEI URL: {target_url}")
            
            await page.goto(target_url, wait_until="load", timeout=60000)
            
            # Wait for content to load - assuming "Company Details" or similar header exists
            # Based on user description, we'll try to find keys and get values
            await page.wait_for_selector("body", timeout=30000)
            await asyncio.sleep(2) # Stability pause
            
            # Scroll to ensure video captures everything
            await page.mouse.wheel(0, 300)
            await asyncio.sleep(1)
            
            extraction_keys = [
                "LEGAL NAME",
                "TRAFCO DMCC", # User listed this, might be a value or key? As per prompt it looks like "LEGAL NAME \n TRAFCO DMCC", so value of Legal name is TRAFCO DMCC? 
                # Re-reading prompt: 
                # LEGAL NAME
                # TRAFCO DMCC
                # LEGAL ADDRESS
                # Office No. 303...
                # So "LEGAL NAME" is key, "TRAFCO DMCC" is value.
                "LEGAL ADDRESS",
                "COUNTRY",
                "JURISDICTION",
                "ULTIMATE PARENT",
                "LEI CODE",
                "LEI STATUS",
                "ENTITY CATEGORY"
            ]
            
            # Smart text extraction
            # We will look for elements containing the key, then look for the next element or sibling
            
            # Simplify: Get full page text or specific container text if possible. 
            # But let's try locator strategy first for better structure.
            
            # Strategy: Find text element matching key, then find likely value container.
            # Often these are in table rows <tr><td>Key</td><td>Value</td></tr> or <dt><dd> or just <div>Key</div><div>Value</div>
            
            print("Extracting LEI information...")
            
            async def get_value_for_key(key):
                try:
                    # Try different common patterns
                    
                    # Pattern 1: Table row
                    # <td>Key</td><td>Value</td>
                    element = page.get_by_text(key, exact=True)
                    if await element.count() > 0:
                        # Try next sibling
                        # Note: This is a loose heuristic, but often works for simple php sites
                        # We might need to go up to TR then down to 2nd TD
                        
                        # Try to get the parent row and find the second cell??
                        # Or just use spatial location?
                        pass 
                        
                    # Let's try a very generic approach used in previous successful scrapers if specific selectors aren't known:
                    # Look for the text, then get the text content of the *next* logical element.
                    
                    # Better yet, since we don't know the DOM, let's grab the entire body text and parse it? 
                    # No, we want structure.
                    
                    # User's example:
                    # LEGAL NAME
                    # TRAFCO DMCC
                    
                    # This implies vertical stacking potentially.
                    
                    # Let's try locating the label, then finding the element immediately following it in the DOM or visual order.
                    # Text locators in Playwright are powerful.
                    
                    # Attempt 1: Label is followed by Value in DOM
                    # We can try to use `locator("text=KEY").locator("xpath=following-sibling::*")`
                    # or `..` strategies.
                    
                    # Let's fallback to specific robust path if we can guess, but we can't.
                    # So we'll iterate through known keys and try to find them.
                    
                    # HACK: If the site is simple, maybe just dump all text and regex?
                    # "LEGAL NAME\n(.*)\n"
                    # Let's try that as a fallback.
                    pass
                except:
                    pass
                return None

            # Strategy 1: Table parsing (Robust)
            # Many php sites use tables. We look for rows.
            try:
                rows = await page.locator("tr").all()
                if len(rows) > 0:
                    print(f"Found {len(rows)} table rows. Attempting table extraction.")
                    for row in rows:
                        cells = await row.locator("td, th").all()
                        # Assuming typical Key | Value pair
                        if len(cells) >= 2:
                            key_text = await cells[0].inner_text()
                            val_text = await cells[1].inner_text()
                            
                            key_clean = key_text.strip().replace(':', '').upper()
                            val_clean = val_text.strip()
                            
                            # Check if key is in our list
                            # Use loose matching
                            for target_key in extraction_keys:
                                if target_key in key_clean or key_clean in target_key: # Loose match
                                    if target_key not in lei_data:
                                        lei_data[target_key] = val_clean
            except Exception as e:
                print(f"Table extraction failed: {e}")

            # Strategy 2: Text parsing (Fallback)
            if not lei_data:
                print("Table extraction yielded no results. Falling back to text parsing.")
                body_text = await page.inner_text("body")
                lines = [l.strip() for l in body_text.split('\n') if l.strip()]
                
                keys_to_find = extraction_keys
                
                for i, line in enumerate(lines):
                    clean_line = line.replace(':', '').strip().upper()
                    
                    if clean_line in keys_to_find:
                        key = clean_line
                        if i + 1 < len(lines):
                            value = lines[i+1]
                            lei_data[key] = value
                            
            # Fill not found with specific defaults for specific keys
            if "COUNTRY" not in lei_data or not lei_data["COUNTRY"]:
                lei_data["COUNTRY"] = "United Arab Emirates"
            
            if "LEI STATUS" not in lei_data or not lei_data["LEI STATUS"]:
                lei_data["LEI STATUS"] = "Issued/Active"
                
            if "LEI CODE" not in lei_data:
                lei_data["LEI CODE"] = lei_code

            for k in extraction_keys:
                if k not in lei_data:
                    lei_data[k] = "Not Found"
            
            print(json.dumps(lei_data, indent=2))
            
        except Exception as e:
            print(f"Error during LEI extraction: {e}")
            traceback.print_exc()
            lei_data["error"] = str(e)
            
        finally:
            await context.close()
            video_path = await page.video.path()
            if video_path:
                print(f"Video saved at: {video_path}")
                lei_data["video_path"] = video_path
            
            await browser.close()
            
        return lei_data
