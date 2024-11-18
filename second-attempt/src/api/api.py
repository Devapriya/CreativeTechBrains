from flask import Flask
from azure.core.credentials import AzureKeyCredential
from azure.ai.formrecognizer import DocumentAnalysisClient
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route('/api/route', methods=['POST'])
def functioncall():
        endpoint = "https://docintellictb.cognitiveservices.azure.com/"
        key = ""

        # sample document
        formUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/DriverLicense.png"

        document_analysis_client = DocumentAnalysisClient(
            endpoint=endpoint, credential=AzureKeyCredential(key)
        )

        poller = document_analysis_client.begin_analyze_document_from_url("prebuilt-idDocument", formUrl)
        id_documents = poller.result()

        first_name = id_documents.documents[0].fields
        print(list(first_name.keys()))
            
        return list(first_name.keys())

if __name__ == '__main__':
    app.run(debug=True)
