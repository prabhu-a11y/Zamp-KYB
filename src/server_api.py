import sys
# Python 3.9 compatibility patch for google-generativeai
if sys.version_info < (3, 10):
    try:
        import importlib.metadata
        import importlib_metadata
        if not hasattr(importlib.metadata, "packages_distributions"):
            importlib.metadata.packages_distributions = importlib_metadata.packages_distributions
            importlib.metadata.version = importlib_metadata.version
            importlib.metadata.PackageNotFoundError = importlib_metadata.PackageNotFoundError
    except ImportError:
        pass

from fastapi import FastAPI, HTTPException, File, UploadFile
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import asyncio
import os
import json
import shutil
from datetime import datetime
from browser import extract_license_info
from browser_lei import extract_lei_info
from browser2 import extract_website_data
import google.generativeai as genai
from supabase import create_client, Client

# --- Supabase Configuration ---
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_SERVICE_ROLE_KEY") # Use Service Role Key for backend operations

# Try reading from .env manually if not in environment
if not SUPABASE_URL or not SUPABASE_KEY:
    try:
        with open(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'), 'r') as f:
            for line in f:
                if line.startswith("VITE_SUPABASE_URL="):
                    SUPABASE_URL = line.split("=", 1)[1].strip().strip('"')
                elif line.startswith("VITE_SUPABASE_SERVICE_ROLE_KEY="):
                    SUPABASE_KEY = line.split("=", 1)[1].strip().strip('"')
    except:
        pass

supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Failed to initialize Supabase client: {e}")

# Configure Gemini
GENAI_API_KEY = os.getenv("VITE_GEMINI_API_KEY") 

if not GENAI_API_KEY:
    try:
        with open(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'), 'r') as f:
            for line in f:
                if line.startswith("VITE_GEMINI_API_KEY="):
                    GENAI_API_KEY = line.split("=", 1)[1].strip().strip('"')
                    break
    except:
        pass

if GENAI_API_KEY:
    genai.configure(api_key=GENAI_API_KEY)

app = FastAPI()

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LEIRequest(BaseModel):
    leiCode: str

# Helper to upload bytes/file to Supabase
async def upload_to_supabase(file_data, filename, content_type=None):
    if not supabase:
        raise Exception("Supabase not configured")
    try:
        # Check if file exists (optional, overwrite logic)
        # Just upload, Supabase defaults to overwrite=False usually, but we can manage filenames
        res = supabase.storage.from_("zamp-uploads").upload(
            filename,
            file_data,
            {"content-type": content_type} if content_type else None
        )
        # Get public URL
        public_url = supabase.storage.from_("zamp-uploads").get_public_url(filename)
        return public_url
    except Exception as e:
        print(f"Supabase upload error: {e}")
        # Fallback: if already exists, return URL
        return supabase.storage.from_("zamp-uploads").get_public_url(filename)

@app.post("/verify-lei")
async def verify_lei(request: LEIRequest):
    try:
        print(f"Received request for LEI: {request.leiCode}")
        
        # Run extraction
        data = await extract_lei_info(request.leiCode)
        
        # Handle Video
        video_path = data.get("video_path")
        public_video_path = None
        
        if video_path and os.path.exists(video_path) and supabase:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            video_filename = f"lei_check_{request.leiCode}_{timestamp}.webm"
            
            with open(video_path, 'rb') as f:
                public_video_path = await upload_to_supabase(f.read(), video_filename, "video/webm")
            
            data["public_video_path"] = public_video_path
            print(f"Video uploaded to: {public_video_path}")
            
        return data

    except Exception as e:
        print(f"Error verifying LEI: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class LicenseRequest(BaseModel):
    licenseNumber: str

class WebsiteRequest(BaseModel):
    url: str

class ZampInitRequest(BaseModel):
    processName: str
    team: str

class ZampLogRequest(BaseModel):
    processId: str
    log: dict # { title, status, time, artifacts, ... }
    stepId: str = None # Optional ID to identify unique steps for updates
    keyDetails: dict = None # Optional updates to key details
    metadata: dict = None # Optional updates to top-level process metadata (e.g. status, applicantName)

class HelpChatRequest(BaseModel):
    query: str
    contextData: dict = {}
    stepInfo: str = ""

def get_knowledge_base():
    try:
        kb_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "src", "docs", "knowledge-base.md")
        if os.path.exists(kb_path):
            with open(kb_path, 'r') as f:
                return f.read()
    except Exception as e:
        print(f"Error reading knowledge base: {e}")
    return ""

@app.post("/extract-license")
async def extract_license(request: LicenseRequest):
    try:
        print(f"Received request for license: {request.licenseNumber}")
        
        # Run the extraction logic
        data = await extract_license_info(request.licenseNumber)
        
        # Handle Video
        video_path = data.get("video_path")
        public_video_path = None
        
        if video_path and os.path.exists(video_path) and supabase:
            # Generate unique filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            video_filename = f"license_check_{request.licenseNumber}_{timestamp}.webm"
            
            with open(video_path, 'rb') as f:
                public_video_path = await upload_to_supabase(f.read(), video_filename, "video/webm")
            
            data["public_video_path"] = public_video_path
            print(f"Video uploaded to: {public_video_path}")
        
        return data
        
    except Exception as e:
        print(f"Error processing request: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def extract_qr_url(file_path: str):
    """
    Uses Gemini to identify QR code in the image and extract the URL.
    """
    try:
        if not GENAI_API_KEY:
            print("Gemini API Key missing")
            return None

        # Upload file to Gemini
        sample_file = genai.upload_file(file_path)
        print(f"Uploaded file to Gemini: {sample_file.uri}")

        model = genai.GenerativeModel("gemini-2.5-flash-lite")
        
        prompt = """
        Extract the URL encoded in the QR code within this image. 
        Also extract the "License Number" from the text.
        
        You MUST return the result in valid JSON format only. Do not add any conversational text.
        format:
        { 
            "url": "https://...", 
            "licenseNumber": "123..." 
        }
        """
        
        response = model.generate_content([sample_file, prompt])
        print(f"Gemini QR Response: {response.text}")
        
        text = response.text.replace('```json', '').replace('```', '').strip()
        data = json.loads(text)
        
        return data

    except Exception as e:
        print(f"Error extracting QR URL with Gemini: {e}")
        return None

@app.post("/verify-trade-license-file")
async def verify_trade_license_file(file: UploadFile = File(...)):
    try:
        # Save locally temporarily for processing (Gemini needs a path or bytes)
        # We can pass bytes to Gemini later, but let's stick to temp file for now
        temp_filename = f"temp_upload_{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}"
        # Use /tmp for serverless envs
        temp_path = os.path.join("/tmp", temp_filename)
        
        with open(temp_path, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)
            
        print(f"File saved for QR scan: {temp_path}")
        
        # 1. Extract URL via Gemini
        qr_data = await extract_qr_url(temp_path)
        
        url = qr_data.get("url") if qr_data else None
        
        if not url:
            return {"error": "Could not identify a QR code URL."}
            
        print(f"Extracted URL from QR: {url}")
        
        # 2. Run Browser Agent
        data = await extract_license_info(direct_url=url)
        
        # 3. Handle Video upload to Supabase
        video_path = data.get("video_path")
        if video_path and os.path.exists(video_path) and supabase:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            video_filename = f"license_check_qr_{timestamp}.webm"
            
            with open(video_path, 'rb') as f:
                data["public_video_path"] = await upload_to_supabase(f.read(), video_filename, "video/webm")
        
        # Upload the original file as well
        if supabase:
            with open(temp_path, 'rb') as f:
                data["uploaded_file_path"] = await upload_to_supabase(f.read(), temp_filename)
        
        return data

    except Exception as e:
        print(f"Error verifying trade license file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/verify-website")
async def verify_website(request: WebsiteRequest):
    try:
        print(f"Received request for website: {request.url}")
        
        # Run extraction
        data = await extract_website_data(request.url)
        
        # Handle Video
        video_path = data.get("video_path")
        
        if video_path and os.path.exists(video_path) and supabase:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            video_filename = f"website_check_{timestamp}.webm"
            
            with open(video_path, 'rb') as f:
                data["public_video_path"] = await upload_to_supabase(f.read(), video_filename, "video/webm")
            
        return data

    except Exception as e:
        print(f"Error verifying website: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class AddressMatchRequest(BaseModel):
    address1: str
    address2: str

@app.post("/match-addresses")
async def match_addresses(request: AddressMatchRequest):
    try:
        if not GENAI_API_KEY:
             return {"match": False, "reason": "No API Key"}

        model = genai.GenerativeModel('gemini-2.5-flash-lite')
        prompt = f"""
        Compare these two addresses and determine if they refer to the same location/building/entity.
        Address 1: "{request.address1}"
        Address 2: "{request.address2}"
        
        Strictness: Moderate. Different formats (e.g. "St." vs "Street", "Dubai" included or not) are accepable.
        Return ONLY valid JSON with format: {{ "match": boolean, "reason": "short explanation" }}
        """
        
        response = model.generate_content(prompt)
        text = response.text.replace('```json', '').replace('```', '').strip()
        data = json.loads(text)
        return data

    except Exception as e:
        print(f"Error matching addresses: {e}")
        return {"match": False, "reason": str(e)}

class NameMatchRequest(BaseModel):
    name1: str
    name2: str

@app.post("/match-names")
async def match_names(request: NameMatchRequest):
    try:
        n1 = request.name1.lower().strip()
        n2 = request.name2.lower().strip()
        
        if n1 == n2:
             return {"match": True, "confidence": 1.0, "reason": "Exact match"}
             
        if not GENAI_API_KEY:
             return {"match": False, "reason": "No AI Key"}

        model = genai.GenerativeModel('gemini-2.5-flash-lite')
        prompt = f"""
        Compare these two names:
        Name 1: "{request.name1}"
        Name 2: "{request.name2}"
        Return ONLY valid JSON with format: {{ "match": boolean, "confidence": float, "reason": "explanation" }}
        """
        response = model.generate_content(prompt)
        text = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(text)

    except Exception as e:
        return {"match": False, "confidence": 0.0, "reason": str(e)}

# --- Zamp Integration Endpoints (Supabase Backed) ---

@app.post("/zamp/init")
async def zamp_init(request: ZampInitRequest):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    try:
        # Check for latest ID logic (optional in DB, can use serial or count)
        res = supabase.table("processes").select("id", count="exact").execute()
        count = len(res.data) # Simple count-based ID (ok for demo)
        new_id = str(count + 1)
        
        today = datetime.now().strftime("%Y-%m-%d")

        # Initial Details Structure
        initial_details = {
            "id": new_id,
            "sections": {
                "overview": {"title": "Overview", "content": "Process Overview"},
                "activityLogs": {"title": "Activity Logs", "items": []},
                "keyDetails": {"title": "Key Details", "items": []},
                "messages": {"title": "Messages", "items": []},
                "sidebarArtifacts": {"title": "Artifacts", "items": []}
            }
        }

        # Insert new process
        new_process = {
            "id": new_id,
            "stock_id": f"{request.processName} #{new_id}",
            "applicant_name": "Wio Applicant",
            "status": "In Progress",
            "created_at": datetime.now().isoformat(),
            "details": initial_details
        }
        
        supabase.table("processes").insert(new_process).execute()
        return {"processId": new_id}
        
    except Exception as e:
        print(f"Error initializing Zamp process: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/zamp/log")
async def zamp_log(request: ZampLogRequest):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    try:
        # Fetch current details
        res = supabase.table("processes").select("details").eq("id", request.processId).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Process not found")
            
        process_data = res.data[0]["details"]
        if not process_data:
            process_data = {"id": request.processId, "sections": {"activityLogs": {"items": []}, "keyDetails": {"items": []}, "sidebarArtifacts": {"items": []}}}
        
        # Ensure timestamp
        if "time" not in request.log:
            request.log["time"] = datetime.now().strftime("%I:%M %p")
        if request.stepId:
            request.log["stepId"] = request.stepId

        # Update Activity Logs
        logs = process_data["sections"]["activityLogs"]["items"]
        updated = False
        if request.stepId:
            for i, item in enumerate(logs):
                if item.get("stepId") == request.stepId:
                    logs[i].update(request.log)
                    updated = True
                    break
        if not updated:
            logs.append(request.log)

        # Sync Artifacts
        if "artifacts" in request.log and request.log["artifacts"]:
            if "sidebarArtifacts" not in process_data["sections"]:
                 process_data["sections"]["sidebarArtifacts"] = {"title": "Artifacts", "items": []}
            
            existing_ids = set(item.get("id") for item in process_data["sections"]["sidebarArtifacts"]["items"])
            for artifact in request.log["artifacts"]:
                if artifact.get("id") not in existing_ids:
                    process_data["sections"]["sidebarArtifacts"]["items"].append(artifact)

        # Update Key Details
        if request.keyDetails:
             if isinstance(request.keyDetails, dict):
                 process_data["sections"]["keyDetails"]["items"].append(request.keyDetails)
             elif isinstance(request.keyDetails, list):
                  process_data["sections"]["keyDetails"]["items"].extend(request.keyDetails)

        # Update Database
        update_payload = {"details": process_data}
        
        # Update Meta fields if present
        if request.metadata:
            if "status" in request.metadata:
                update_payload["status"] = request.metadata["status"]
            if "applicantName" in request.metadata:
                update_payload["applicant_name"] = request.metadata["applicantName"]

        supabase.table("processes").update(update_payload).eq("id", request.processId).execute()
        return {"status": "success"}

    except Exception as e:
        print(f"Error logging to Zamp: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/zamp/upload")
async def zamp_upload(file: UploadFile = File(...)):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    try:
        file_content = await file.read()
        filename = f"uploads/{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}"
        public_url = await upload_to_supabase(file_content, filename, file.content_type)
        return {"path": public_url}
        
    except Exception as e:
        print(f"Error uploading file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat/help")
async def chat_help(request: HelpChatRequest):
    try:
        if not GENAI_API_KEY:
            raise HTTPException(status_code=500, detail="Gemini API Key not configured")

        model = genai.GenerativeModel('gemini-2.5-flash-lite')
        knowledge_base_content = get_knowledge_base()
        
        system_instruction = f"""You are a helpful assistant for Wio Business Onboarding.
        KNOWLEDGE BASE: {knowledge_base_content}
        CONTEXT STEP: {request.stepInfo}
        USER DATA: {json.dumps(request.contextData)}
        """
        
        chat = model.start_chat(history=[
            {"role": "user", "parts": [system_instruction + f"\n\nQUERY: {request.query}"]}
        ])
        
        response = chat.send_message(request.query)
        return {"response": response.text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class MessageRequest(BaseModel):
    processId: str
    sender: str
    content: str

@app.post("/zamp/message")
async def send_message(request: MessageRequest):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    try:
        res = supabase.table("processes").select("details").eq("id", request.processId).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Process not found")
            
        process_data = res.data[0]["details"]
        if "messages" not in process_data["sections"]:
             process_data["sections"]["messages"] = {"title": "Messages", "items": []}

        new_message = {
            "id": f"msg-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "sender": request.sender,
            "content": request.content,
            "time": datetime.now().strftime("%I:%M %p"),
            "timestamp": datetime.now().isoformat()
        }

        process_data["sections"]["messages"]["items"].append(new_message)
        
        supabase.table("processes").update({"details": process_data}).eq("id", request.processId).execute()
        return {"status": "success", "message": new_message}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/zamp/messages/{processId}")
async def get_messages(processId: str):
    if not supabase:
         return {"messages": []}
    try:
        res = supabase.table("processes").select("details").eq("id", processId).execute()
        if res.data:
            return {"messages": res.data[0]["details"].get("sections", {}).get("messages", {}).get("items", [])}
        return {"messages": []}
    except Exception:
        return {"messages": []}

@app.get("/zamp/status/{processId}")
async def get_process_status(processId: str):
    if not supabase:
         return {"status": "Unknown"}
    try:
        res = supabase.table("processes").select("status").eq("id", processId).execute()
        if res.data:
            return {"status": res.data[0]["status"]}
        return {"status": "Unknown"}
    except Exception:
        return {"status": "Unknown"}

@app.post("/zamp/approve/{processId}")
async def approve_application(processId: str):
    if not supabase:
         raise HTTPException(status_code=500, detail="Supabase not configured")
    try:
        # Fetch, Update Log, Update Status
        res = supabase.table("processes").select("details").eq("id", processId).execute()
        if not res.data:
             raise HTTPException(status_code=404, detail="Process not found")
        
        process_data = res.data[0]["details"]
        
        # Add Log
        approval_log = {
            "title": "Application Approved",
            "status": "success",
            "type": "success",
            "time": datetime.now().strftime("%I:%M %p"),
            "description": "Application has been approved by the Zamp team."
        }
        process_data["sections"]["activityLogs"]["items"].append(approval_log)
        
        # Update Key Details
        kd_items = process_data["sections"]["keyDetails"].get("items", [])
        if kd_items:
            kd_items[-1]["status"] = "Done"
        else:
            kd_items.append({"status": "Done"})

        # Update DB
        supabase.table("processes").update({
            "status": "Done",
            "details": process_data
        }).eq("id", processId).execute()

        return {"status": "success"}

    except Exception as e:
        print(f"Error approving application: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
