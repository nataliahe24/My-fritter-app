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
  
  socialLinks = [
    { name: 'Facebook', icon: 'facebook', url: 'https://web.facebook.com/profile.php?id=100095436910699#' },
    { name: 'WhatsApp', icon: 'wsp', url: 'https://api.whatsapp.com/send/?phone=573208844038' },
    { name: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/mibunuelocucuta/' }
  ];
} 