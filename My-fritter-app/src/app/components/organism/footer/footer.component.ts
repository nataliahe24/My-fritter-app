import { Component } from '@angular/core';

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  socialLinks: SocialLink[] = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/mibunuelocucuta/',
      icon: 'instagram'
    },
    {
      name: 'WhatsApp',
      url: 'https://api.whatsapp.com/send/?phone=573208844038',
      icon: 'whatsapp'
    },
    {
      name: 'Facebook',
      url: 'https://web.facebook.com/profile.php?id=100095436910699#',
      icon: 'facebook'
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@mibunuelocucuta',
      icon: 'tiktok'
    }
  ];
} 