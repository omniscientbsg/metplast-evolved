import urllib.request
import re
import os

url = 'https://metplast.com/gallery/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    urls = set(re.findall(r'https://metplast\.com/wp-content/uploads/[^"\s\'>]+\.(?:jpg|jpeg|png|webp)', html))
    
    # Let's filter for 600x540 which are the gallery thumbnails
    gallery_urls = [u for u in urls if '600x540' in u]
    if len(gallery_urls) < 6:
        gallery_urls = list(urls)[:6]
        
    os.makedirs('public/images/gallery', exist_ok=True)
    
    saved_files = []
    for i, u in enumerate(gallery_urls[:6]):
        filename = u.split('/')[-1]
        filepath = os.path.join('public/images/gallery', filename)
        urllib.request.urlretrieve(u, filepath)
        saved_files.append(filename)
        
    print("Saved files:", saved_files)
except Exception as e:
    print("Error:", e)
