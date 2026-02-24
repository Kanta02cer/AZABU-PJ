const fs = require('fs');
const path = './src/pages/home/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Fix imageUrl issue
content = content.replace(
  '<SectionBg variant="warm" opacity={0.03} id="留意事項">',
  '<SectionBg variant="warm" imageUrl="https://readdy.ai/api/search-image?query=Abstract%20elegant%20minimalist%20warm%20amber%20lines%20on%20cream%20background%2C%20subtle%20gradient%2C%20professional%20corporate%20aesthetic%2C%20ultra%20wide%20panoramic%20composition&width=1920&height=800&seq=bg-attention-section-v1&orientation=landscape" opacity={0.03} id="留意事項">'
);

// Mobile text size optimizations
content = content.replace(/text-\[28px\] sm:text-5xl lg:text-6xl/g, 'text-3xl md:text-5xl lg:text-6xl');
content = content.replace(/text-\[28px\] sm:text-5xl/g, 'text-3xl md:text-5xl');
content = content.replace(/text-\[28px\] sm:text-4xl lg:text-5xl/g, 'text-3xl md:text-4xl lg:text-5xl');
content = content.replace(/text-\[28px\] sm:text-4xl/g, 'text-3xl md:text-4xl');
content = content.replace(/text-2xl sm:text-4xl/g, 'text-2xl md:text-3xl lg:text-4xl');

// Mobile padding optimizations 
content = content.replace(/py-12 sm:py-32/g, 'py-12 md:py-24 lg:py-32');
content = content.replace(/py-12 sm:py-24/g, 'py-10 md:py-16 lg:py-24');

fs.writeFileSync(path, content);
console.log("Updated heading sizes, padding, and fixed imageUrl lint error globally.");
