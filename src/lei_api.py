import requests
from typing import Dict, Optional

async def extract_lei_info_api(lei_code: str) -> Dict:
    """
    Extract LEI company details using the GLEIF API
    
    Args:
        lei_code: The 20-character LEI code
        
    Returns:
        dict: Extracted company details
    """
    try:
        # GLEIF API endpoint
        url = f"https://api.gleif.org/api/v1/lei-records/{lei_code}"
        
        headers = {
            "Accept": "application/vnd.api+json",
            "User-Agent": "Zamp-KYB/1.0"
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code != 200:
            return {
                "error": f"LEI not found or API error (status {response.status_code})",
                "LEI CODE": lei_code,
                "LEI STATUS": "Not Found"
            }
        
        data = response.json()
        
        # Extract relevant fields from GLEIF response
        lei_record = data.get("data", {})
        attributes = lei_record.get("attributes", {})
        entity = attributes.get("entity", {})
        legal_address = entity.get("legalAddress", {})
        headquarters_address = entity.get("headquartersAddress", {})
        registration = attributes.get("registration", {})
        
        # Build structured response matching the old format
        lei_data = {
            "LEGAL NAME": entity.get("legalName", {}).get("name", "Not Found"),
            "LEI CODE": lei_code,
            "LEI STATUS": registration.get("status", "Unknown"),
            "ENTITY CATEGORY": entity.get("category", "Not Found"),
            "LEGAL ADDRESS": format_address(legal_address),
            "COUNTRY": legal_address.get("country", "Not Found"),
            "JURISDICTION": legal_address.get("country", "Not Found"),
            "REGISTRATION AUTHORITY": registration.get("registrationAuthority", {}).get("name", "Not Found"),
            "REGISTRATION NUMBER": registration.get("registrationNumber", "Not Found"),
        }
        
        # Add ultimate parent if available
        relationships_url = lei_record.get("relationships", {}).get("ultimate-parent", {}).get("links", {}).get("related")
        if relationships_url:
            try:
                parent_response = requests.get(relationships_url, headers=headers, timeout=5)
                if parent_response.status_code == 200:
                    parent_data = parent_response.json()
                    parent_entity = parent_data.get("data", {}).get("attributes", {}).get("entity", {})
                    lei_data["ULTIMATE PARENT"] = parent_entity.get("legalName", {}).get("name", "Not Found")
                else:
                    lei_data["ULTIMATE PARENT"] = "Not Found"
            except:
                lei_data["ULTIMATE PARENT"] = "Not Found"
        else:
            lei_data["ULTIMATE PARENT"] = "None (Self)"
        
        print(f"Successfully fetched LEI data for {lei_code}")
        return lei_data
        
    except requests.exceptions.Timeout:
        return {
            "error": "API request timed out",
            "LEI CODE": lei_code,
            "LEI STATUS": "API Timeout"
        }
    except Exception as e:
        print(f"Error fetching LEI data: {e}")
        return {
            "error": str(e),
            "LEI CODE": lei_code,
            "LEI STATUS": "Error"
        }

def format_address(address_dict: Dict) -> str:
    """Format GLEIF address dict into a single string"""
    if not address_dict:
        return "Not Found"
    
    parts = []
    
    # Add address lines
    for key in ["addressLine1", "addressLine2", "addressLine3", "addressLine4"]:
        if address_dict.get(key):
            parts.append(address_dict[key])
    
    # Add city, region, postal code
    city = address_dict.get("city", "")
    region = address_dict.get("region", "")
    postal = address_dict.get("postalCode", "")
    
    location_parts = [p for p in [city, region, postal] if p]
    if location_parts:
        parts.append(", ".join(location_parts))
    
    # Add country
    if address_dict.get("country"):
        parts.append(address_dict["country"])
    
    return ", ".join(parts) if parts else "Not Found"
