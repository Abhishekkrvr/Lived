import "./globals.css";
export const metadata={
  title:"LIVED. | Your Life in Numbers",
  description:"See your life in years, weeks, days, hours, minutes, seconds and estimated heartbeats."
};
export default function RootLayout({children}){
  return <html lang="en"><body>{children}</body></html>
}