import sys
import math
from PIL import Image

def remove_background(image_path, output_path, tolerance=50):
    img = Image.open(image_path).convert("RGBA")
    data = img.getdata()
    
    # Assuming top-left pixel is background
    bg_color = data[0]
    
    new_data = []
    for item in data:
        # Calculate color distance
        # item is (R, G, B, A)
        dist = math.sqrt((item[0] - bg_color[0])**2 + (item[1] - bg_color[1])**2 + (item[2] - bg_color[2])**2)
        
        if dist < tolerance:
            # Change to transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Saved {output_path}")

if __name__ == "__main__":
    img_path = sys.argv[1]
    out_path = sys.argv[2]
    tol = int(sys.argv[3]) if len(sys.argv) > 3 else 30
    remove_background(img_path, out_path, tol)
