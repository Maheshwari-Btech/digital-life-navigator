"""
Synthetic demo tasks for Digital Life Navigator.
100% safe, synthetic data designed for less-confident digital users.
No real personal data, passwords, OTPs, or government submissions.
"""
from typing import Dict, Any, List

SYNTHETIC_TASK_CATALOG = [
    {
        "type": "sample_application",
        "title": "Sample Online Application",
        "description": "Practice filling out and submitting a simple digital form one step at a time without any fear of mistakes.",
        "estimated_minutes": 4,
        "total_steps": 5,
        "badge": "Most Popular",
        "steps": [
            {
                "step_number": 1,
                "title": "Open the application section",
                "instruction": "Look for the large blue button that says 'Start Application' or click on the first section.",
                "explanation": "Starting the form doesn't submit anything yet. It just opens the workspace for you to see what is needed.",
                "simplified_hint": "Find the button that says 'Start Application' on your screen and click it once.",
                "recovery_guidance": "If the screen didn't change, check if a new tab opened or look for a box marked 'Application Form'."
            },
            {
                "step_number": 2,
                "title": "Enter your basic details",
                "instruction": "Type your name and contact number into the boxes marked with an asterisk (*).",
                "explanation": "These details help the service identify who is applying and send you confirmation updates.",
                "simplified_hint": "Only fill the boxes that have a star (*). The other boxes are optional.",
                "recovery_guidance": "If a red warning appears, check that your phone number has 10 digits and your name has no numbers."
            },
            {
                "step_number": 3,
                "title": "Check the uploaded document",
                "instruction": "Review the file preview to make sure the file name is readable and correctly attached.",
                "explanation": "Checking your file before proceeding prevents rejection later.",
                "simplified_hint": "Look at the small picture or file name. If it looks blurry or wrong, click 'Replace'.",
                "recovery_guidance": "If you picked the wrong file, don't worry! Click 'Remove' or 'Replace' and select the right sample file."
            },
            {
                "step_number": 4,
                "title": "Review the information",
                "instruction": "Read through the summary on your screen to verify that your name and details match your records.",
                "explanation": "Taking thirty seconds to review gives you peace of mind before the final confirmation.",
                "simplified_hint": "Read each line slowly. If anything looks incorrect, you can click 'Edit' to change it.",
                "recovery_guidance": "Notice a typo? Click the 'Edit' button next to that section to correct it without starting over."
            },
            {
                "step_number": 5,
                "title": "Submit the sample application",
                "instruction": "Click the green 'Submit Application' button and wait for your confirmation reference number.",
                "explanation": "Once submitted, you will receive a reference number to track your submission.",
                "simplified_hint": "Click the 'Submit' button once. You do not need to click it twice.",
                "recovery_guidance": "If the button stays grey, scroll up to check if any required box was left empty."
            }
        ]
    },
    {
        "type": "document_verification",
        "title": "Sample Document Verification",
        "description": "Learn how to safely verify your document upload, match names, and avoid common verification mistakes.",
        "estimated_minutes": 3,
        "total_steps": 5,
        "badge": "Verification",
        "steps": [
            {
                "step_number": 1,
                "title": "Open the document section",
                "instruction": "Click on 'Documents' or 'Upload Verification' to view your pending document status.",
                "explanation": "This takes you to the secure page where documents are verified.",
                "simplified_hint": "Look for a folder or paper icon labeled 'Documents' and click it.",
                "recovery_guidance": "If you don't see it, check the top menu or the left navigation panel."
            },
            {
                "step_number": 2,
                "title": "Check that the name matches",
                "instruction": "Confirm that the spelling of your name on the document matches your application exactly.",
                "explanation": "Automated verification checks name spelling letter-by-letter to protect your identity.",
                "simplified_hint": "Compare every letter of your first and last name. Ensure no spelling difference.",
                "recovery_guidance": "If the names don't match, you can update your profile name before uploading."
            },
            {
                "step_number": 3,
                "title": "Verify photo and issue date",
                "instruction": "Make sure all four corners of the document are visible and the expiry date is in the future.",
                "explanation": "Clear photos ensure the automated reader can verify your details without human delays.",
                "simplified_hint": "Ensure the picture is not dark or blurry, and the text can be read easily.",
                "recovery_guidance": "If the image is cut off at the edge, take a fresh picture with all four corners visible."
            },
            {
                "step_number": 4,
                "title": "Confirm document type",
                "instruction": "Select the correct category from the dropdown (e.g. Identity Card or Proof of Address).",
                "explanation": "Matching the category ensures your document goes to the correct verification queue.",
                "simplified_hint": "Click the dropdown and choose the document name that matches what you are submitting.",
                "recovery_guidance": "If you aren't sure which category, 'Photo Identity Card' is the standard choice."
            },
            {
                "step_number": 5,
                "title": "Confirm and save verification",
                "instruction": "Click 'Confirm Document' and note down the verification tracking code.",
                "explanation": "This seals your submission and starts the verification process.",
                "simplified_hint": "Press 'Confirm Document' to finish.",
                "recovery_guidance": "Check for a green checkmark or confirmation badge indicating success."
            }
        ]
    },
    {
        "type": "utility_bill",
        "title": "Sample Utility Bill Verification",
        "description": "Step-by-step guidance on safely checking your electricity or water bill before making an online payment.",
        "estimated_minutes": 3,
        "total_steps": 4,
        "badge": "Billing",
        "steps": [
            {
                "step_number": 1,
                "title": "Open the billing statement",
                "instruction": "Find your recent statement or click 'View Latest Bill' on the portal.",
                "explanation": "Looking at the statement shows what you are actually being charged for.",
                "simplified_hint": "Click 'View Latest Bill' to open your monthly charges.",
                "recovery_guidance": "If the PDF doesn't open, look at the summary numbers shown on screen."
            },
            {
                "step_number": 2,
                "title": "Match your Consumer ID",
                "instruction": "Check that the 10-digit Consumer ID matches the number printed on your paper meter bill.",
                "explanation": "Verifying your Consumer ID guarantees you are paying your own bill and not someone else's.",
                "simplified_hint": "Look for the number next to 'Consumer No.' or 'Account ID' and match it with your bill.",
                "recovery_guidance": "If the numbers differ, do not pay yet! Go back to search by your correct Consumer ID."
            },
            {
                "step_number": 3,
                "title": "Verify due date and amount",
                "instruction": "Verify that the bill amount looks normal and the due date is within the payment window.",
                "explanation": "Catching unexpected meter surges or late fees early prevents overpayment.",
                "simplified_hint": "Look at the bold amount in Rupees. Does it match your expected monthly usage?",
                "recovery_guidance": "If the amount seems surprisingly high, check if previous unpaid months were added."
            },
            {
                "step_number": 4,
                "title": "Proceed to safe checkout",
                "instruction": "Click 'Proceed to Payment' and choose your preferred safe payment method.",
                "explanation": "Never share your PIN, UPI passcode, or bank OTP with anyone claiming to help.",
                "simplified_hint": "Click 'Proceed'. Remember: nobody legitimate will ever ask you for your secret PIN.",
                "recovery_guidance": "If any pop-up asks for your banking password or OTP over the phone, cancel immediately."
            }
        ]
    }
]

def get_task_template(task_type: str) -> Dict[str, Any]:
    """Retrieve task template by type; defaults to sample_application."""
    for task in SYNTHETIC_TASK_CATALOG:
        if task["type"] == task_type:
            return task
    return SYNTHETIC_TASK_CATALOG[0]
