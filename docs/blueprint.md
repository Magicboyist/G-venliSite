# **App Name**: Net Patrol

## Core Features:

- URL Input: The user enters a URL to check.
- Security Score Calculation: Calculate a composite safety score between 0 and 100, based on simple rules, and display the result.
- Security Status Display: Display security status with color-coded categories (Safe, Suspicious, Dangerous).
- Detailed Security Analysis: Display details of the security analysis, including SSL certificate validity, protocol, domain registration age, presence of suspicious JavaScript files, existence of security layers (firewall, bot protection), source of resources, hosting country, and known breaches.
- Past Scans Storage: Store past scans in the browser's localStorage or IndexedDB.
- Past Scans List: List previous analyses with URL, date, score, and security class, with button to clear.
- USOM Reporting Button: If a URL is marked as dangerous, provide a button to open the USOM reporting form in a new tab.

## Style Guidelines:

- Primary color: Saturated blue (#2962FF) for trust and security.
- Background color: Light blue (#E6EEFF) to create a calm, secure feeling.
- Accent color: Yellow-green (#99E64F), analogous to the primary but significantly brighter, for clear calls to action.
- Body and headline font: 'Inter', a sans-serif for its modern, neutral, and objective feel. 
- Use simple, clear icons to represent different aspects of the security analysis.
- Prioritize a clear, single-column layout, adapting fluidly to desktop and mobile views.
- Employ subtle transitions and loading animations to enhance user experience without distraction.