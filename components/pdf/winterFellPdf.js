export const TemplateJourneyRouters = (data) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>JR Quotation</title>
  <style>
    @page { size: A4; margin: 12mm; }
    html, body { margin: 0; padding: 0; }
    body { background: #000; font-family: Verdana, Arial, sans-serif; }
    .page-break { page-break-before: always; }
    .pre.size-a4 { width: 55rem; margin: 0 auto; color: #fff; }
    .page1 {
      width: 54.85rem; height: 78rem; border: 1px solid; background-color: #ffffff;
      background-position: top; background-repeat: no-repeat; background-size: cover;
      position: relative; color: #fff;
    }
    .page3 {
      width: 55rem; height: fit-content; min-height: 78rem; display: flex;
      flex-direction: column; background-position: top; background-repeat: no-repeat;
      background-size: cover; position: relative;
    }
    .footer {
      margin-top: 3rem; color: #ffffff; display: flex; justify-content: space-evenly;
      align-items: center; font-family: Verdana; font-size: 1.5rem; letter-spacing: 1px;
    }
    .page1whatsApp { height: 4rem; margin-left: 25rem; margin-top: 63rem; }
    .DividerLine { width: 0.2rem; height: 5rem; background-color: #ffffff; margin-right: -3rem; }
    .footer_call_for_more_info { display: flex; flex-direction: column; margin-left: 1rem; }
    .footer_img_with_text { display: flex; }
    .footer_web_info { display: flex; width: 29rem; }
    .web_info_text { margin-left: -3rem; }
    .href { margin-left: 0.3rem; color: #ffffff; text-decoration: none; display: flex; }
    .page2 {
      width: 55rem; height: 78rem; display: flex; flex-direction: column;
      background-position: top; background-repeat: no-repeat; background-size: cover;
      position: relative;
    }
    .HotelPage {
      word-break: break-word; width: 55rem; display: flex; justify-content: space-between;
      background-position: top; background-repeat: no-repeat; background-size: cover;
    }
    .itinearypage {
      width: 55rem; display: flex; justify-content: space-between;
      background-position: top; background-repeat: no-repeat; background-size: cover;
    }
    .inclusion {
      width: 55rem; justify-content: space-between; background-position: top;
      background-repeat: no-repeat; background-size: cover;
    }
    .package_details {
      margin-top: 0.8rem; margin-left: 13rem; font-size: 1.9rem; display: flex;
      justify-content: space-between; width: 33rem; color: #ffffff;
    }
    .yellow_details {
      margin-top: 12rem; color: black; margin-left: 19rem; font-size: 2rem;
      font-family: verdana; width: 24rem; background: rgba(255,255,0,0.85);
      padding: 0.8rem 1rem; border-radius: 0.4rem;
    }
    .setPara { margin-left: 5rem; }
    .seth4 { font-size: 2.3rem; margin-left: 1rem; margin-bottom: 3rem; }
    .setParas { text-transform: capitalize; margin-left: 5.4rem !important; margin-top: -3rem; }
    .inclusionPage_blocks {
      font-size: 4rem; display: flex; color: #ffffff; text-transform: capitalize;
      justify-content: space-around; font-family: sans-serif; font-weight: 900;
    }
    .inclusionPage_img { width: 55rem; }
    .inclusionExclusionDetails {
      font-family: "Glacial Indifference", Verdana, sans-serif; text-transform: capitalize;
      display: flex; justify-content: space-evenly; color: #ffffff; margin-top: 1rem;
      margin-bottom: 5rem;
    }
    .sepratorLineForInclusionExclusion { width: 0.2rem; background-color: #ffffff; }
    .aliner_ {
      margin-bottom: 0.4rem; display: flex; align-items: center; font-size: 1.6rem;
      width: 18rem; justify-content: space-between; font-family: verdana; margin-left: 4rem;
    }
    .setInsta { width: 25rem; margin-left: 15rem; margin-top: 1.5rem; }
    .headLineDaywiseItineary {
      font-family: sans-serif; font-weight: 900; text-transform: capitalize;
      color: #ffffff; font-size: 4rem; margin-left: 1.5rem;
    }
    .mapitineary {
      text-transform: uppercase; color: #ffffff; display: flex;
      justify-content: space-between; align-items: center;
      font-family: "Glacial Indifference", Verdana, sans-serif;
    }
    .itinearyDiv {
      word-break: break-word; margin-left: 2rem; margin-top: 2rem;
      font-size: 1.2rem; margin-bottom: 5rem;
    }
    .itinearyDiv img { width: 40rem; object-fit: contain; }
    .DaywiseItinearyDiv, .DaywiseItinearyDivReverse {
      display: flex; justify-content: space-between; color: #ffffff;
      align-items: center; width: 100%; padding: 1rem; box-sizing: border-box;
    }
    .DaywiseItinearyDivReverse { flex-direction: row-reverse; column-gap: 20px; }
    .DaywiseItinearyDivleft { width: 80%; display: flex; flex-direction: column; }
    .dayheader {
      color: yellow; font-family: "Glacial Indifference", Verdana, sans-serif;
      text-transform: uppercase;
    }
    .dayDetailsitineary {
      color: #ffffff; font-family: "Glacial Indifference", Arial, sans-serif;
      text-transform: capitalize;
    }
    .hotelUni { margin-left: 1.5rem; color: #ffffff; display: flex; }
    .hotelUniRight {
      margin-left: 3rem; font-size: 1.4rem;
      font-family: "Glacial Indifference", Verdana, sans-serif;
    }
    .flightsImgcss { width: 52rem; margin: 1.5rem; }
    .otherInclusion { margin-left: 3rem; font-family: verdana; font-size: 1.6rem; }
    .trip_summary {
      margin-top: 25.2rem; color: #05e0e9; font-size: 2rem;
      margin-left: 3.5rem; margin-bottom: 0.5rem;
    }
    .trip_summary_maldives {
      margin-top: 0; color: #05e0e9; font-size: 2rem;
      margin-left: 3.5rem; margin-bottom: 0.5rem;
    }
    .paymentsPage { margin-top: 75rem; }
    .footer-strip {
      background-image: url('https://journeyrouters-webassets.s3.ap-south-1.amazonaws.com/2025/uploads/seprateFooter1.jpg');
      background-position: top; background-repeat: no-repeat; background-size: cover;
      height: 5.5rem; width: 100%; display: flex; flex-direction: column-reverse;
    }
    .footer-content {
      display: flex; justify-content: space-evenly; align-items: center;
      color: #fff; letter-spacing: 1px; font-size: 1.2rem; padding: 0.6rem 0;
    }
    .footer-col { display: flex; align-items: center; gap: 0.6rem; }
    .footer-col img { height: 3rem; }
  </style>
</head>
<body>
  <div class="pre size-a4">
    <div class="page1" style="background-image: url('https://firebasestorage.googleapis.com/v0/b/destination_image/o/${(data.DestinationName || '').toUpperCase()}%2FHeader.png?alt=media');">
      <a href="https://wa.me/${data.PhoneNumber || '8368045646'}" target="_blank">
        <img class="page1whatsApp" crossOrigin="anonymous" src="https://journeyrouters-webassets.s3.ap-south-1.amazonaws.com/2025/uploads/whatApp.png" alt="WhatsApp"/>
      </a>
      <div class="footer" style="position:absolute; bottom: 0; left:0; width:100%; padding-bottom: 1rem;">
        <a class="href" href="tel:${data.PhoneNumber || '8368045646'}">
          <div class="footer_img_with_text">
            <img src="https://journeyrouters-webassets.s3.ap-south-1.amazonaws.com/2025/uploads/callinglogo.png" crossOrigin="anonymous" alt="Call Icon" height="63"/>
            <div class="footer_call_for_more_info">
              <span>Call for More Information</span>
              <span>+91- ${data.PhoneNumber || '8368045646'}</span>
            </div>
          </div>
        </a>
        <div class="DividerLine"></div>
        <div class="footer_web_info">
          <a class="href" href="https://www.journeyrouters.com/" target="_blank">
            <div><img src="https://journeyrouters-webassets.s3.ap-south-1.amazonaws.com/2025/uploads/weblogo.png" crossOrigin="anonymous" alt="Website Icon" height="63"/></div>
            <div class="web_info_text"><span>Visit Us At</span><br/><span>www.journeyrouters.com</span></div>
          </a>
        </div>
      </div>
    </div>
    <div class="page-break">
      <div class="page2" style="background-image: url('https://firebasestorage.googleapis.com/v0/b/destination_image/o/${(data.DestinationName || '').toUpperCase()}%2FPackageDetails.png?alt=media');">
        <div class="${(data.DestinationName || '').toUpperCase() === 'MALDIVES' ? 'trip_summary_maldives' : 'trip_summary'}">
          <span>TRIP ID:-&nbsp;</span><span>${data.TripId || ''}</span>
        </div>
        <div class="package_details">
          <div>
            <span>Name</span><br/>
            <span>Destination</span><br/>
            <span>Date</span><br/>
            <span>Duration</span><br/>
            <span>Traveler</span>
          </div>
          <div>
            <span>- ${data.FullName || ''}</span><br/>
            <span>- ${data.DestinationName || ''}</span><br/>
            <span>- ${data.TravelDate || ''}</span><br/>
            <span>- ${data.Days || 0} Days, ${(data.Days || 0) - 1} Nights</span><br/>
            <span>- ${data.NoOfPax || 0} Adults${data.Child ? `, ${data.Child} Child` : ''}${data.Infant ? `, ${data.Infant} Infant` : ''}</span><br/>
          </div>
        </div>
        <div class="yellow_details" style="color:#000;">
          <p class="dayDetails">${data.Days || 0} Days, ${(data.Days || 0) - 1} Nights</p>
          <p class="setPara">at justsd</p>
          <h4 class="seth4">${data.CurrencyType === 'Dollar' ? 'USD' : 'INR'} : ${(data.TotalCost ?? 0).toLocaleString('en-IN')}/-</h4>
          <p class="setParas" style="${data.PriceType === 'Total' ? 'margin-left:5.4rem' : ''}">${data.PriceType || ''}</p>
        </div>
        <div class="footer-strip" style="position:absolute; bottom:0; left:0;">
          <div class="footer-content">
            <div class="footer-col">
              <img src="https://journeyrouters-webassets.s3.ap-south-1.amazonaws.com/2025/uploads/callinglogo.png" alt="Call"/>
              <div><div>Call for More Information</div><div>+91- ${data.PhoneNumber || '8368045646'}</div></div>
            </div>
            <div style="width:0.2rem;height:3rem;background:#fff;"></div>
            <div class="footer-col">
              <img src="https://journeyrouters-webassets.s3.ap-south-1.amazonaws.com/2025/uploads/weblogo.png" alt="Web"/>
              <div><div>Visit Us At</div><div>www.journeyrouters.com</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-break">
      <div class="inclusion" style="background:#000;">
        <img class="inclusionPage_img" src="https://firebasestorage.googleapis.com/v0/b/destination_image/o/${(data.DestinationName || '').toUpperCase()}%2FInclusionExclusion.png?alt=media" alt="Inclusion Exclusion Header"/>
        <div class="inclusionPage_blocks"><span>Inclusion</span><span>Exclusion</span></div>
        <div class="inclusionExclusionDetails">
          <div style="width:50%;">
            ${(data.Inclusions || []).map((txt) => `<div class="aliner_"><span><img src="https://journeyrouters-webassets.s3.ap-south-1.amazonaws.com/2025/uploads/correct.png" width="16" height="16" style="margin-right:0.3rem" crossOrigin="anonymous" alt="Check"/>${txt}</span></div>`).join('')}
            <div class="otherInclusion">
              ${(data.OtherInclusions ? data.OtherInclusions.split('\\n') : []).map((ln) => `<div><div style="display:flex; align-items:center; font-size:17px; margin-left:2rem; margin-bottom:-1.7rem; overflow-wrap:break-word;"><span>-&nbsp;</span><span>${ln.trim()}</span></div><br/></div>`).join('')}
            </div>
          </div>
          <div class="sepratorLineForInclusionExclusion"></div>
          <div style="width:50%;">
            ${(data.Exclusions || []).map((txt) => `<div class="aliner_"><span><img src="https://journeyrouters-webassets.s3.ap-south-1.amazonaws.com/2025/uploads/cross.png" width="16" height="16" style="margin-right:0.3rem" crossOrigin="anonymous" alt="Cross"/>${txt}</span></div>`).join('')}
            <div class="otherInclusion">
              ${(data.OtherExclusions ? data.OtherExclusions.split('\\n') : []).map((ln) => `<div><div style="display:flex; align-items:center; font-size:17px; margin-left:2rem; margin-bottom:-1.7rem; overflow-wrap:break-word;"><span>-&nbsp;</span><span>${ln.trim()}</span></div><br/></div>`).join('')}
            </div>
          </div>
        </div>
        <a href="https://www.instagram.com/journeyrouters/?hl=en" target="_blank">
          <img class="setInsta" src="https://journeyrouters-webassets.s3.ap-south-1.amazonaws.com/2025/uploads/insta2.png" crossOrigin="anonymous" alt="Instagram"/>
        </a>
        <div class="footer-strip">
          <div class="footer-content">
            <div>For more info: +91- ${data.PhoneNumber || '8368045646'}</div>
            <div>www.journeyrouters.com</div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-break">
      <div class="page2" style="background-image:url('https://journeyrouters-webassets.s3.ap-south-1.amazonaws.com/2025/uploads/jrgoogleReview.png');">
        <div class="google-review" style="margin-top: 20rem; align-items:center; display: flex; flex-direction: column;">
          <img style="width: 18rem;" src="https://journeyrouters-webassets.s3.ap-south-1.amazonaws.com/2025/uploads/google-stars.png" alt="Stars" crossOrigin="anonymous"/>
          <div class="google-review-count" style="margin-left: 0; margin-top: 1rem;">Over ${data.GoogleReviewCount || '1,500+'} 5★ reviews</div>
        </div>
        <div class="footer-strip" style="position:absolute; bottom:0; left:0;">
          <div class="footer-content">
            <div>Call us: +91- ${data.PhoneNumber || '8368045646'}</div>
            <div>Visit: www.journeyrouters.com</div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-break">
      <div class="itinearypage" style="position:relative; background:#000;">
        <div class="page2" style="height: fit-content;">
          <div style="background-image:url('https://firebasestorage.googleapis.com/v0/b/destination_image/o/${(data.DestinationName || '').toUpperCase()}%2FDayWiseItineary.png?alt=media'); background-position:top; background-repeat:no-repeat; background-size:cover; height:18rem; width:100%;"></div>
          <span class="headLineDaywiseItineary">Day wise Itinerary</span>
          <div class="itinearyDiv">
            ${(data.Itinearies || []).map((it, idx) => `<div class="mapitineary" style="margin-bottom:4rem;"><span style="width:5rem;"><span>Day</span> ${idx + 1} -</span><p style="width:91%; text-transform:uppercase;">${it.title || ''}</p></div>`).join('')}
          </div>
          <div class="footer-strip">
            <div class="footer-content">
              <div>+91- ${data.PhoneNumber || '8368045646'}</div>
              <div>www.journeyrouters.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-break">
      <div class="itinearypage" style="position:relative; background:#000;">
        <div class="page3">
          <div style="background-image:url('https://firebasestorage.googleapis.com/v0/b/destination_image/o/${(data.DestinationName || '').toUpperCase()}%2FDetailItineary.png?alt=media'); background-position:top; background-repeat:no-repeat; background-size:cover; height:18rem;"></div>
          <span class="headLineDaywiseItineary">Detail Itinerary</span>
          <div class="itinearyDiv">
            ${(data.Itinearies || []).map((it, index) => `<div class="${((index + 1) % 2 === 0) ? 'DaywiseItinearyDiv' : 'DaywiseItinearyDivReverse'}"><div class="DaywiseItinearyDivleft"><div style="display:flex; justify-content:space-between;"><span class="dayheader">Day ${index + 1} - ${it.title || ''}</span></div><p class="dayDetailsitineary"><div style="margin-bottom:-1rem;">${(it.description ? it.description.split('\\n') : []).filter(line => line.trim() !== '').map(line => `<div>${line.trim()}.</div>`).join('')}</div></p></div><div class="DaywiseItinearyDivRight"><img src="${it.activityImg || 'https://firebasestorage.googleapis.com/v0/b/destination_image/o/BALI%2FArival.png?alt=media'}" crossOrigin="anonymous" style="width:14rem; height:14rem; border-radius:50%; object-fit:cover; object-position:center;" alt="${it.activities || 'Activity Image'}"/></div></div>${((index + 1) % 4 === 0 && index !== (data.Itinearies || []).length - 1) ? '<div class="page-break" style="width:50rem;"></div>' : ''}`).join('')}
          </div>
          <div class="footer-strip">
            <div class="footer-content">
              <div>+91- ${data.PhoneNumber || '8368045646'}</div>
              <div>www.journeyrouters.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    ${(data.Hotels && data.Hotels.length) ? `<div class="page-break"><div class="HotelPage" style="background:#000; flex-direction:column;"><div><img class="inclusionPage_img" src="https://journeyrouters-webassets.s3.ap-south-1.amazonaws.com/2025/uploads/hotel_header.png" alt="Hotel Header" crossOrigin="anonymous"/><span class="headLineDaywiseItineary">Accommodations</span>${data.Hotels.map((h, index) => `<div class="hotelUni"><div><img src="https://firebasestorage.googleapis.com/v0/b/jrspark-adb98.appspot.com/o/pdfHelperImages%2Fhotel${index + 1}.png?alt=media" width="320" alt="Hotel ${index+1}"/></div><div class="hotelUniRight"><h4 style="color:yellow;">${(h.nights || []).map(n => `<span>${n},</span>`).join('')} Stay at ${h.city || ''}</h4><span>Hotel - ${h.name || ''}</span><br/><span>Meal - ${(h.meals || []).map(m => `<span>${m}, </span>`).join('')}</span><br/><span>Room - ${h.roomType || ''}</span><br/><span>Hotel Category - ${h.category || ''} Star</span><br/><br/><span style="color:#ff6858;">Check In Date - ${h.checkInDate || ''}</span><br/><span style="color:#ff6858;">Check Out Date - ${h.checkOutDate || ''}</span></div></div>`).join('')}<div class="footer-strip" style="margin-top:2rem;"><div class="footer-content"><div>+91- ${data.PhoneNumber || '8368045646'}</div><div>www.journeyrouters.com</div></div></div></div></div></div>` : ''}
    ${(data.flightsImagesLinks && data.flightsImagesLinks.length) ? `<div class="page-break"><div class="itinearypage" style="position:relative; background:#000;"><div class="page3"><div style="background-image:url('https://journeyrouters-webassets.s3.ap-south-1.amazonaws.com/2025/uploads/FlightsHeader.png'); background-position:top; background-repeat:no-repeat; background-size:cover; height:18rem;"></div><span class="headLineDaywiseItineary">Flight</span><div class="itinearyDiv">${data.flightsImagesLinks.map((link, index) => `<img key="${index}" class="flightsImgcss" src="${link}" alt="Flight Image ${index+1}" crossOrigin="anonymous"/>`).join('')}</div><span style="text-decoration:underline; color:#bbc9ef; margin-left:13rem; font-size:13px; font-style:italic;">Note - Flight Fare is Dynamic, Actual Cost would be Shared at the Time of Booking</span><div class="footer-strip" style="margin-top:2rem;"><div class="footer-content"><div>+91- ${data.PhoneNumber || '8368045646'}</div><div>www.journeyrouters.com</div></div></div></div></div></div>` : ''}
    <div class="page-break">
      <div class="page2" style="background-image:url('https://journeyrouters-webassets.s3.ap-south-1.amazonaws.com/2025/uploads/payment.png');">
        <div class="paymentsPage">
          <div class="footer-strip">
            <div class="footer-content">
              <div>+91- ${data.PhoneNumber || '8368045646'}</div>
              <div>www.journeyrouters.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
};

export const TemplateWinterfell = (data) => {
  const ClientName = data.ClientName || data["Client-Name"] || "Rahul";
  const Itinerary = data.Itinerary || [];
  const DetailedItinerary = data.Itinearies || [];
  const {
    DestinationName = "Bali",
    NoOfPax = 2,
    TravelDate = "2026-11-10",
    Days = 5,
    Nights = 4,
    Costs = { TotalCost: 40000 },
    Hotels = [
      { Name: "The Anathera Resort", RoomType: "Deluxe Room with Pool View", Meals: ["Breakfast"], CheckInDate: "10th Nov", CheckOutDate: "15th Nov", ImageUrl: "https://d30j33t1r58ioz.cloudfront.net/static/sample-hotel.jpg" },
      { Name: "Aeera Villa Canggu", RoomType: "One Bedroom Villa with Private Pool", Meals: ["Breakfast"], CheckInDate: "15th Nov", CheckOutDate: "18th Nov", ImageUrl: "https://d30j33t1r58ioz.cloudfront.net/static/sample-hotel2.jpg" }
    ],
    Inclusions = [],
    Exclusions = [],
  } = data;

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      : "-";

  const bg = "https://d30j33t1r58ioz.cloudfront.net/static/mountain-bg-light.jpg";

  return `
  <html>
    <head>
      <style>
        @page { 
          size: A4; 
          margin: 0; 
          width: 210mm;
          height: 297mm;
        }
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          color: #111;
          background: #fff;
          font-size: 18px;
        }
        h1,h2,h3,h4 { margin: 0; padding: 0; }

        .page {
          page-break-after: always;
          padding: 0;
          width: 210mm;
          height: 297mm;
          position: relative;
          background-image: url('${bg}');
          background-size: cover;
          background-position: bottom;
          background-repeat: no-repeat;
          box-sizing: border-box;
        }

        .cover {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 297mm;
          text-align: center;
          padding: 60px;
        }

        .logo-box {
          background: #000;
          color: #fff;
          padding: 40px 70px;
          font-size: 48px;
          font-weight: 700;
          letter-spacing: 4px;
          margin-bottom: 50px;
          text-align: center;
          line-height: 1.2;
        }

        .tagline {
          font-size: 28px;
          font-style: italic;
          color: #333;
          font-weight: 400;
          line-height: 1.4;
          margin-bottom: 50px;
        }

        .content-page {
          padding: 40px 30px;
          background: rgba(255, 255, 255, 0.95);
          margin: 20px;
          border-radius: 8px;
          min-height: calc(297mm - 80px);
        }

        .section-title {
          background: #000;
          color: #fff;
          text-align: center;
          font-size: 26px;
          font-weight: 600;
          padding: 20px;
          margin-bottom: 35px;
          letter-spacing: 1px;
        }

        .package-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 20px;
          margin-bottom: 50px;
        }
        
        .package-table th {
          background: #f5f5f5;
          padding: 20px 25px;
          border: 1px solid #ddd;
          font-weight: 600;
          text-align: left;
          width: 35%;
        }
        
        .package-table td {
          padding: 20px 25px;
          border: 1px solid #ddd;
          background: #fff;
        }

        .price-container {
          display: flex;
          justify-content: center;
          margin: 40px 0;
        }

        .price-box {
          position: relative;
          background: #333;
          color: #fff;
          font-size: 24px;
          font-weight: 700;
          padding: 25px 45px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .price-text {
          font-size: 36px;
          margin-bottom: 8px;
        }

        .price-label {
          font-size: 24px;
          font-weight: 600;
        }

        .price-decoration {
          position: absolute;
          top: -10px;
          right: -10px;
          width: 50px;
          height: 50px;
          background: #4a90e2;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .price-decoration::before {
          content: "💰";
          font-size: 20px;
        }

        .itinerary-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
          margin-bottom: 30px;
        }
        
        .itinerary-table th {
          background: #000;
          color: #fff;
          padding: 12px 15px;
          font-weight: 600;
          text-align: left;
        }
        
        .itinerary-table td {
          padding: 12px 15px;
          border: 1px solid #ddd;
          background: #fff;
        }

        .detailed-day {
          margin-bottom: 40px;
          padding-bottom: 30px;
          border-bottom: 2px solid #eee;
          page-break-inside: avoid;
          min-height: 200px;
        }


        .day-header {
          display: flex;
          align-items: center;
          margin-bottom: 25px;
        }

        .day-icon {
          width: 80px;
          height: 80px;
          background: #4a90e2;
          border-radius: 50%;
          margin-right: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 32px;
          flex-shrink: 0;
        }

        .day-title {
          font-size: 22px;
          font-weight: 600;
          color: #333;
          line-height: 1.3;
        }

        .day-content {
          font-size: 16px;
          line-height: 1.7;
          color: #555;
          margin-bottom: 25px;
        }

        .day-image {
          width: 100%;
          max-width: 400px;
          height: 250px;
          object-fit: cover;
          border-radius: 12px;
          margin: 20px 0;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .activity-item {
          margin: 8px 0;
          padding-left: 20px;
          position: relative;
        }

        .activity-item:before {
          content: "•";
          position: absolute;
          left: 0;
          color: #4a90e2;
          font-weight: bold;
        }

        .separator {
          text-align: center;
          margin: 30px 0;
          font-size: 20px;
          color: #ccc;
        }

        .accommodation-card {
          display: flex;
          margin-bottom: 30px;
          background: #fff;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 3px 15px rgba(0,0,0,0.1);
          padding: 15px;
          align-items: flex-start;
        }

        .hotel-image {
          width: 180px;
          height: 140px;
          object-fit: cover;
          border-radius: 15px;
          margin-right: 25px;
          flex-shrink: 0;
        }

        .hotel-details {
          flex: 1;
          padding: 5px 0;
        }

        .hotel-details ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .hotel-details li {
          margin: 8px 0;
          font-size: 14px;
          position: relative;
          padding-left: 15px;
          line-height: 1.4;
        }

        .hotel-details li:before {
          content: "•";
          position: absolute;
          left: 0;
          color: #333;
          font-weight: bold;
        }

        .footer-logo {
          position: absolute;
          bottom: 20px;
          right: 30px;
          background: #000;
          color: #fff;
          padding: 8px 16px;
          font-size: 10px;
          font-weight: 600;
          text-align: center;
          line-height: 1.2;
        }

        .center { text-align: center; }
        
        p {
          font-size: 14px;
          line-height: 1.6;
          margin: 10px 0;
        }

        .scenic-image {
          width: 100%;
          height: 300px;
          object-fit: cover;
          border-radius: 8px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>

      <!-- Cover Page -->
      <div class="page cover">
        <div class="logo-box">WINTERFELL<br/>HOLIDAYS</div>
        <div class="tagline">Designed for Dreamers.<br/>Built for Travelers...</div>
        <div class="footer-logo">WINTERFELL<br/>HOLIDAYS</div>
      </div>

      <!-- Package Details -->
      <div class="page">
        <div class="content-page">
          <div class="section-title">Package Details</div>
          <table class="package-table">
            <tr><th>Destination</th><td>${DestinationName}</td></tr>
            <tr><th>Name</th><td>${ClientName}</td></tr>
            <tr><th>No of Pax</th><td>${NoOfPax} Adults</td></tr>
            <tr><th>Date</th><td>${formatDate(TravelDate)}</td></tr>
            <tr><th>Duration</th><td>${Days} Days ${Nights} Nights</td></tr>
          </table>
          <div class="price-container">
            <div class="price-box">
              <div class="price-decoration"></div>
              <div class="price-text">INR ${Costs?.TotalCost?.toLocaleString("en-IN") || "40,000"}/-</div>
              <div class="price-label">Total</div>
            </div>
          </div>
        </div>
        <div class="footer-logo">WINTERFELL<br/>HOLIDAYS</div>
      </div>

      <!-- Accommodation -->
      <div class="page">
        <div class="content-page">
          <div class="section-title">Accommodation</div>
          ${Hotels.map((h, index) => `
            <div class="accommodation-card">
              <img class="hotel-image" src="${h.ImageUrl || "https://d30j33t1r58ioz.cloudfront.net/static/sample-hotel.jpg"}" alt="Hotel Image"/>
              <div class="hotel-details">
                <ul>
                  <li>Hotel - ${h.Name || "The Anathera Resort"}</li>
                  <li>Room - ${h.RoomType || "Deluxe Room with Pool View"}</li>
                  <li>Meal - ${"Breakfast"}</li>
                  <li>No of Rooms - 1</li>
                  <li>No of Nights - ${index === 0 ? "5" : "2"}</li>
                  <li>Check IN - ${h.CheckInDate || "10th Nov"}</li>
                  <li>Check OUT - ${h.CheckOutDate || "15th Nov"}</li>
                </ul>
              </div>
            </div>
            ${index < Hotels.length - 1 ? '<div class="separator">✤</div>' : ''}
          `).join("")}
        </div>
        <div class="footer-logo">WINTERFELL<br/>HOLIDAYS</div>
      </div>

      <!-- Detailed Itinerary -->
      ${(() => {
        const itemsPerPage = 2;
        const pages = [];
        for (let i = 0; i < DetailedItinerary.length; i += itemsPerPage) {
          const pageItems = DetailedItinerary.slice(i, i + itemsPerPage);
          pages.push(`
            <div class="page">
              <div class="content-page">
                ${i === 0 ? '<div class="section-title">Detailed Itinerary</div>' : ''}
                ${pageItems.map((day, pageIndex) => {
                  const globalIndex = i + pageIndex;
                  const getIcon = (index) => {
                    const icons = ['✈', '🏛', '🏰', '🏔', '🌊', '🎭', '🍷', '🎨', '🌅'];
                    return icons[index % icons.length] || '🗺';
                  };
                  return `
                    <div class="detailed-day">
                      <div class="day-header">
                        <div class="day-icon">${getIcon(globalIndex)}</div>
                        <div class="day-title">Day ${day.day || globalIndex + 1} - ${day.Title || "Day Activity"}</div>
                      </div>
                      ${day.ImageUrl ? `<img class="day-image" src="${day.ImageUrl}" alt="Day ${day.day || globalIndex + 1} Activity"/>` : ''}
                      <div class="day-content">
                        ${day.Description ? day.Description.replace(/<[^>]*>/g, '') : day.Activities || "No description available"}
                      </div>
                      ${pageIndex < pageItems.length - 1 ? '<div class="separator">✤</div>' : ''}
                    </div>
                  `;
                }).join('')}
              </div>
              <div class="footer-logo">WINTERFELL<br/>HOLIDAYS</div>
            </div>
          `);
        }
        return pages.join('');
      })()}

      <!-- Day Wise Itinerary -->
      <div class="page">
        <div class="content-page">
          <div class="section-title">Day Wise Itinerary</div>
          <table class="itinerary-table">
            <tr>
              <th style="width: 15%;">Date</th>
              <th style="width: 15%;">Day</th>
              <th style="width: 70%;">Title</th>
            </tr>
            <tr><td>10th Nov</td><td>Day 1</td><td>Bali Arrival</td></tr>
            <tr><td>11th Nov</td><td>Day 2</td><td>Water Sports + Uluwatu Temple + Kecak Fire Dance</td></tr>
            <tr><td>12th Nov</td><td>Day 3</td><td>Nusa Penida Tour + Lunch (Excluding $3 PP Island Fee)</td></tr>
            <tr><td>13th Nov</td><td>Day 4</td><td>Inter Transfer + Tanah Lot</td></tr>
            <tr><td>14th Nov</td><td>Day 5</td><td>Ubud Tour + Bali Aloha Swing Package</td></tr>
            <tr><td>15th Nov</td><td>Day 6</td><td>Departure</td></tr>
          </table>
          <img class="scenic-image" src="https://d30j33t1r58ioz.cloudfront.net/static/sample-beach.jpg" alt="Scenic View"/>
        </div>
        <div class="footer-logo">WINTERFELL<br/>HOLIDAYS</div>
      </div>

    </body>
  </html>
`;
};
