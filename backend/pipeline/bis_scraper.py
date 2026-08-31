import requests
from bs4 import BeautifulSoup

URL = "https://www.services.bis.gov.in/php/BIS_2.0/BISConnect/Standards/IndianStandards"

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X)"
}

response = requests.get(URL, headers=headers)

print("Status:", response.status_code)
print("Final URL:", response.url)

soup = BeautifulSoup(response.text, "html.parser")

print("Page Title:", soup.title.text if soup.title else "No title")

print(response.text[:300])