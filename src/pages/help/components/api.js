/* File: ApiDocumentation.jsx */
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

export const ApiDocumentation = () => {
  // Change this if your BASE_NAME is different than the default "sigpy"
  const BASE_NAME = "sigpy";
  const BASE_URL = `/${BASE_NAME}`;

  const scrollPage = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop-100,
        behavior: 'smooth',
      });
    }
  };

  // A helper for rendering code snippets using react-syntax-highlighter
  const CodeBlock = ({ language, children }) => (
    <SyntaxHighlighter language={language} style={okaidia}>
      {children}
    </SyntaxHighlighter>
  );

  return (
    <div style={{ padding: "0px",  lineHeight: "1.6" }}>
        <br/><br/>
      <h2 id="apidoc">API Documentation</h2>
    
    <pre>
      <span style={{ cursor: 'pointer', color: 'blue', paddingRight: "8px"}} onClick={() => scrollPage('test')}>Test and Service</span>|
       <span style={{ cursor: 'pointer', color: 'blue', padding: "8px"}} onClick={() => scrollPage('metasearchapi')}>Metadata</span>| 
       <span style={{ cursor: 'pointer', color: 'blue', padding: "8px"}} onClick={() => scrollPage('dataextract')}>Data extraction</span>| 
       <span style={{ cursor: 'pointer', color: 'blue', padding: "8px"}} onClick={() => scrollPage('datasearch')}>Data query</span>| 
       <span style={{ cursor: 'pointer', color: 'blue', padding: "8px"}} onClick={() => scrollPage('correlationsearch')}>Gene correlation</span>|
       <span style={{ cursor: 'pointer', color: 'blue', padding: "8px"}} onClick={() => scrollPage('differential')}>Marker gene</span> <br/><br/>
    </pre>

      <p>
        Most data interactions performed by the ARCHS4 website are served via public APIs. For larger or many queries resort to the ARCHS4 Python or R packages.
      </p>


      <h2 id="test" style={{marginTop: "40px"}}>Test and Service Status Endpoints</h2>
      <ul  style={{marginLeft: "20px"}}>
        <li>
          <h3>Status Endpoint</h3>
          <p>
            <strong>GET {BASE_URL}/status</strong>
          </p>
          <p>Returns the current service status (active/updating) and the date of the last data update.</p>
          <p>
            <strong>Example (cURL):</strong>
          </p>
          <CodeBlock language="bash">
            {`curl GET https://maayanlab.cloud${BASE_URL}/status`}
          </CodeBlock>
        </li>
      </ul>

      <hr />

      <h2 id="metasearchapi" style={{marginTop: "40px"}}>Metadata Endpoints</h2>
      <ul style={{marginLeft: "20px"}}>
        <li>
          <h3>Quick Search Metadata</h3>
          <p>
            <strong>GET {BASE_URL}/meta/quicksearch</strong>
          </p>
          <p>
            Query Parameters:
            <br />• query – search term (e.g. GEO accession ID in upper case).
            <br />• species – (optional) defaults to "human".
          </p>
          <p>
            <strong>Example (cURL):</strong>
          </p>
          <CodeBlock language="bash">
            {`curl GET "https://maayanlab.cloud${BASE_URL}/meta/quicksearch?query=kidney&species=human"`}
          </CodeBlock>
          <p>
            <strong>Example (Python):</strong>
          </p>
          <CodeBlock language="python">
            {`import requests

url = "https://maayanlab.cloud/sigpy/meta/quicksearch?query=kidney&species=human"
response = requests.get(url)
samples = response.json()
print("Response:")
print(samples)`}
          </CodeBlock>
        </li>
        <li>
          <h3>List Genes</h3>
          <p>
            <strong>GET or POST {BASE_URL}/meta/genes</strong>
          </p>
          <p>
            Parameters:
            <br />• species – (optional) via query or JSON body, defaults to "human".
            <br />Returns a list of all gene symbols available.
          </p>
          <p>
            <strong>Example (GET):</strong>
          </p>
          <CodeBlock language="bash">
            {`curl GET "https://maayanlab.cloud${BASE_URL}/meta/genes?species=human"`}
          </CodeBlock>
          <p>
            <strong>Example (POST):</strong>
          </p>
          <CodeBlock language="bash">
            {`curl -X POST "https://maayanlab.cloud/sigpy/meta/genes" \\
-H "Content-Type: application/json" \\
-d '{"species": "mouse"}'`}
          </CodeBlock>
        </li>
      </ul>

      <hr />

      <h2 id="dataextract" style={{marginTop: "40px"}}>Data Extraction Endpoints</h2>
      <ul  style={{marginLeft: "20px"}}>
        <li>
          <h3>Request Sample Data</h3>
          <p>
            <strong>GET or POST {BASE_URL}/data/samples</strong>
          </p>
          <p>
            For GET requests, pass a comma-separated list of sample GSM IDs and species as query parameters.
            <br />For POST requests, the JSON payload must include:
            <br />• gsm_ids – an array of GSM IDs.
            <br />• species – (optional) defaults to "human" (options: "human", "mouse").
            <br />Note: Maximum allowed samples is 10,000.
          </p>
          <p>
            <strong>Example (GET):</strong>
          </p>
          <CodeBlock language="bash">
            {`curl GET "https://maayanlab.cloud/sigpy/data/samples?gsm_ids=GSM1335489,GSM1342284&species=human"`}
          </CodeBlock>
          <p>
            <strong>Example (Python POST):</strong>
          </p>
          <CodeBlock language="python">
            {`import requests

url = "https://maayanlab.cloud/sigpy/data/samples"
data = {
    "gsm_ids": ["GSM1335489", "GSM1342284"],
    "species": "human"
}
response = requests.post(url, json=data)
print("Response:", response.json())`}
          </CodeBlock>
        </li>
        <li>
          <h3>Check Task Status for Sample Data Request</h3>
          <p>
            <strong>GET {BASE_URL}/data/samples/status/&lt;task_id&gt;</strong>
          </p>
          <p>Checks the download task status for a previous samples request.</p>
          <p>
            <strong>Example (cURL):</strong>
          </p>
          <CodeBlock language="bash">
            {`curl GET https://maayanlab.cloud${BASE_URL}/data/samples/status/your_task_id_here`}
          </CodeBlock>
          <p>
            <strong>Example (Python):</strong>
          </p>
          <CodeBlock language="python">
            {`import requests

task_id = "your_task_id_here"
url = f"https://maayanlab.cloud/sigpy/data/samples/status/{task_id}"
response = requests.get(url)
print("Response:", response.json())`}
          </CodeBlock>
        </li>
        <li>
          <h3>Download Sample Data Zip</h3>
          <p>
            <strong>GET {BASE_URL}/data/samples/download/&lt;task_id&gt;</strong>
          </p>
          <p>
            Once processing is complete, use this endpoint to download the generated ZIP file containing the data.
          </p>
          <p>
            <strong>Example (cURL):</strong>
          </p>
          <CodeBlock language="bash">
            {`curl GET https://maayanlab.cloud${BASE_URL}/data/samples/download/your_task_id_here -o matrix.zip`}
          </CodeBlock>
          <p>
            <strong>Example (Python):</strong>
          </p>
          <CodeBlock language="python">
            {`import requests

task_id = "your_task_id_here"
url = f"https://maayanlab.cloud/sigpy/data/samples/download/{task_id}"
response = requests.get(url)
with open("matrix.zip", "wb") as f:
    f.write(response.content)
print("File downloaded as matrix.zip")`}
          </CodeBlock>
        </li>
      </ul>

      <hr />

      <h2 id="datasearch" style={{marginTop: "40px"}}>Data Query Endpoints</h2>
      <ul style={{marginLeft: "20px"}}>
        <li>
          <h3>k-NN Signature Query</h3>
          <p>
            <strong>POST {BASE_URL}/data/knn/signature</strong>
          </p>
          <p>
            Request Body Parameters:
            <br />• signatures – your input signature vector.
            <br />• species – e.g. "human" or "mouse".
            <br />• signame – a name identifier for the signature.
            <br />• k – (optional) number of nearest neighbors to return (default is 10).
          </p>
          <div style={{borderRadius: "5px", border: "1px solid black", padding: "12px", marginLeft: "-10px", backgroundColor: "#2dde88"}}>
            k-NN search can be performed either using a gene expression profile (gene counts) or marker genes (up genes for genes that are characteristically upregulated, and down genes that are characteristically down regulated. Down genes can be left blank).
          </div>
          <p>
            <strong>Example Request for up/down gene set k-NN query (Python):</strong>
          </p>
          <CodeBlock  language="python">
            {`import requests

payload = {
  "signatures": [
    {
      "up_genes": [
        "XGY2",
        "HBA1",
        "CA3",
        ...
      ],
      "down_genes": [
        "NRBP2",
        "ASAH2B",
        "PPIL6",
        ...
      ]
    }
  ],
  "species": "human",
  "k": 500,
  "signame": "Example similarity search"
}

url = "https://maayanlab.cloud/sigpy/data/knn/signature"
response = requests.post(url, json=payload)
`}
          </CodeBlock>

          <p>
            <strong>Example Request for full gene expression profile k-NN query (Python):</strong>
          </p>
          <CodeBlock  language="python">
            {`import requests

payload = {
  "signatures": [
    {
      "genes": [
        "XGY2",
        "HBA1",
        "CA3",
        ...
      ],
      "values": [
        421215,
        965,
        12349,
        ...
      ]
    }
  ],
  "species": "human",
  "k": 500,
  "signame": "Example similarity search"
}

url = "https://maayanlab.cloud/sigpy/data/knn/signature"
response = requests.post(url, json=payload)
`}
          </CodeBlock>

          <strong>Example Output:</strong>
        
          <CodeBlock  language="json">
        {`{
    "distances": [
        -0.5242219944566326,
        -0.513229216535615,
        -0.5111980232411404,
        ...
    ],
    "indexes": [
        793578,
        531388,
        572691,
        ...
    ],
    "samples": [
        "GSM7092078",
        "GSM5211863",
        "GSM5397753",
        ...
    ],
    "series_count": 130,
    "signame": "Example similarity search",
    "species": "human"
}`
        }</CodeBlock>


        </li>
        <hr/>
        <li>
          <h3 id="correlationsearch">Gene Correlation Analysis</h3>
          <p>
            <strong>POST {BASE_URL}/data/correlation</strong>
          </p>
          <p>
            Request Body Parameters:
            <br />• gene – the gene symbol to examine.
            <br />• meta – metadata/filter criteria.
            <br />• species – (optional) defaults to "human"  (options: "human", "mouse").
            <br />• k – (optional) number of correlations to return.
          </p>

          <p></p>
          <strong>Example (Python POST):</strong>
          <CodeBlock  language="python">
{`import requests

url = "https://maayanlab.cloud/sigpy/data/correlation"

payload = {
    "gene": "PCSK9",
    "species": "human",
    "meta": "keratinocyte"
}

response = requests.post(url, json=payload)
response.json()`}

          </CodeBlock>

          <strong>Example Output:</strong>
          <CodeBlock  language="python">
{`{
 'gene': 'PCSK9',
 'mean_log_expression': 10.248437881469727,
 'negative_correlated_genes': [
  {'correlation': -0.5214786152955715,
   'gene': 'ENSG00000287180',
   'mean_log_expression': 1.1113303899765015
  },
  {
   'correlation': -0.5077861735543857,
   'gene': 'SLA',
   'mean_log_expression': 0.9335980415344238
  },
 ...],
 'positive_correlated_genes': [
  {
   'correlation': 0.6705970458859031,
   'gene': 'ARTN',
   'mean_log_expression': 8.389211654663086
  },
  {
   'correlation': 0.6586166071822823,
   'gene': 'ITGB4',
   'mean_log_expression': 13.432361602783203
  },
 ...],
 'samples': [
    'GSM1432456',
    'GSM1432458',
    'GSM1446887',
    'GSM1716887',
    ...
  ],
 'searchterm': 'keratinocyte'
}`}</CodeBlock>

        </li>
        <li>
          <h3 id="differential">Differential Expression</h3>
          <p>
            <strong>POST {BASE_URL}/data/diffexp</strong>
          </p>
          <p>
            Request Body Parameters:
            <br />• gene – the gene for which to check differential expression.
            <br />• meta – metadata/filter criteria.
            <br />• species – (optional) defaults to "human"  (options: "human", "mouse").
            <br />• fdr_cutoff – (optional) false discovery rate threshold (default is 0.1).
          </p>
        </li>
      </ul>
    </div>
  );
};
