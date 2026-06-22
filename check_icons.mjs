import * as lucide from "lucide-react";

const iconsToCheck = [
  "Package", "DollarSign", "Clock", "CheckCircle", "XCircle", "Trash2", 
  "Layers", "Save", "Settings", "ShoppingCart", "BarChart3", "Plus", "Edit", "LogOut"
];

const missing = iconsToCheck.filter(icon => !lucide[icon]);

if (missing.length > 0) {
  console.log("Missing icons:", missing);
} else {
  console.log("All icons are present!");
}
