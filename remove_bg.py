from PIL import Image

def mask_to_white(input_path, output_path):
    # Convert image to grayscale (black background, white/gray text)
    img = Image.open(input_path).convert("L")
    
    # Create a solid white image of the same size
    white_img = Image.new("RGBA", img.size, (255, 255, 255, 255))
    
    # Put the grayscale image as the alpha channel (black becomes transparent, white remains opaque white)
    white_img.putalpha(img)
    
    # Crop to the bounding box of the non-transparent pixels
    bbox = white_img.getbbox()
    if bbox:
        white_img = white_img.crop(bbox)
        
    white_img.save(output_path, "PNG")

mask_to_white("public/disney-plus.jpg", "public/disney-user.png")
