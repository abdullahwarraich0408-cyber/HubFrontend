const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync('grep -rnw "app" -e "LabTestsPage\\|DoctorProfilePage\\|VendorDetailPage\\|DoctorsPage\\|ConsultationPage\\|AppointmentFlow\\|MedicinesPage\\|ProfilePage\\|HospitalDetailPage\\|OrdersPage\\|RegisterPage\\|CheckoutPage\\|useSearchParams" | cut -d: -f1 | sort | uniq').toString().trim().split('\n');

for (const file of files) {
  if (!file.endsWith('page.js') && !file.endsWith('page.jsx')) continue;
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('Suspense')) continue;
  
  // Add import
  content = 'import { Suspense } from "react";\n' + content;
  
  // Wrap return statement
  // We match "return ... ;" or "return (...)" 
  // It's safer to just replace the first return statement.
  content = content.replace(/return\s+([^;]+)(;?)/, 'return (\n    <Suspense fallback={<div>Loading...</div>}>\n      $1\n    </Suspense>\n  )$2');
  
  fs.writeFileSync(file, content);
  console.log('Fixed', file);
}
