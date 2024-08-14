export const SEO = {
  title: "ChatPulse",
  description: "Revolutionise your Learning Experience.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "ChatPulse",
    // // url: "https://ChatPulse.vercel.app/",
    siteName: "chatpulse",
    images: [
      { url: "/logo.png" },
      {
        url: "https://chatpulseai.vercel.app/og.png",
        width: 800,
        height: 600,
        alt: "Og Image",
        type: "image/jpeg",
      },
    ],
  },

  themeColor: "light",
  additionalMetaTags: [
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0",
    },
    {
      name: "application-name",
      content: "ChatPulse",
    },
  ],

  additionalLinkTags: [
    {
      rel: "icon",
      href: "https://chatpulseai.vercel.app/favicon.ico",
    },
  ],
};
