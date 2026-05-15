import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'xatom.space',
  description: 'High-end minimal design studio'
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preload" as="image" href="/xatom-v1.png?v=20260515-2" fetchPriority="high" />
        <link rel="preload" as="image" href="/p1-home-mobile.jpg?v=20260515" media="(max-width: 767px)" fetchPriority="high" />
        <link rel="preload" as="video" href="/intro-v3.mp4?v=20260515-7" type="video/mp4" media="(max-width: 767px)" fetchPriority="high" />
        <link rel="preload" as="video" href="/intro-v2.mp4?v=20260515-11" type="video/mp4" media="(min-width: 768px)" fetchPriority="high" />
      </head>
      <body>
        {children}

        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2036767833945376');
            fbq('track', 'PageView');
          `}
        </Script>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2036767833945376&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}