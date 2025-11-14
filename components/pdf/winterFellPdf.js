

export const TemplateJourneyRouters = (data) => {
    // Extract user data from the data object
    const user = data.user || {};
    const userPhone = user?.phone || '8368045646';
    const companyName = user?.CompanyName || 'Winterfell Holidays';
    const companyEmail = user?.email || '';
    const companyAddress = user?.address || '';

    console.log("📄 PDF Template - User Data:", user);

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

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Winterfell Holidays - Quotation</title>
    <style>
        @page { size: A4; margin: 12mm; }
        html, body { margin: 0; padding: 0; }
        body { background: #f7faf9; font-family: Verdana, Arial, sans-serif; }
        .page-break { page-break-before: always; }
        .pre.size-a4 { width: 55rem; margin: 0 auto; color: #fff; }
          .coverpage {
          border:'2px solid red';
        width: 54.85rem;
        height: 70rem;
        background-image: url('https://www.shutterstock.com/image-vector/black-white-landscape-panorama-mountains-260nw-1981188578.jpg');
        background-position: center bottom -90px;
        background-repeat: no-repeat;
        background-size: 167%;
        position: relative;
        color: #fff;
      }  
  .page1 {
        width: 54.85rem;
        height: 78rem;
        background-image: url('https://www.shutterstock.com/image-vector/black-white-landscape-panorama-mountains-260nw-1981188578.jpg');
        background-position: center bottom -70px;
        background-repeat: no-repeat;
        background-size: 167%;
        position: relative;
        color: #fff;
      }       
    .page3 { width: 54.85rem;
    height: fit-content;
        min-height: 70rem;
        background-image: url('https://www.shutterstock.com/image-vector/black-white-landscape-panorama-mountains-260nw-1981188578.jpg');
        background-position: center bottom;
        background-repeat: no-repeat;
        background-size: contain;
        position: relative;
        color: #fff;
        }
        .page-head { background-color: #000; color: white; font-size: 1.6rem; padding: 1rem 0; text-align: center; }
        .package-table { width: 100%; border-collapse: collapse; font-size: 20px; margin-bottom: 50px; }
        .package-table th { background: #f5f5f5; padding: 20px 25px; border: 1px solid #ddd; font-weight: 600; text-align: left; width: 35%; }
        .package-table td { padding: 20px 25px; border: 1px solid #ddd; background: #fff; }
        .price-container { display: flex; justify-content: center; margin: 40px 0; }
        .price-box { position: relative; width: 27rem; height: 10rem; top: 5rem; background: #333; color: #fff; font-size: 24px; font-weight: 700; padding: 25px 45px; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); }
        .price-text { font-size: 47px; margin-top: 2rem; margin-bottom: 8px; }
        .price-label { font-size: 41px; font-weight: 600; }
        .price-decoration { position: absolute; top: -10px; right: -10px; width: 50px; height: 50px; background: #4a90e2; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .price-decoration::before { content: "💰"; font-size: 20px; }
        .itinerary-table { width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 0; }
        .itinerary-table td { padding: 12px 15px; border: 1px solid #ddd; background: #fff; }
        .HotelPage { word-break: break-word; width: 55rem; display: flex; justify-content: space-between; background-position: top; background-repeat: no-repeat; background-size: cover; }
        .hotelUni { color: #ffffff; display: flex; margin-bottom: 1rem; }
        .hotelUniRight { margin-left: 3rem; font-size: 1.4rem; font-family: "Glacial Indifference", Verdana, sans-serif; color: #000; }
        .itinearyDiv { word-break: break-word; font-size: 1.2rem; padding: 2rem; }
        .itinearyDiv ul { color: #000; }
        .itinearyDiv li { color: black; margin: 0.5rem 0; }
        .DaywiseItinearyDiv, .DaywiseItinearyDivReverse { display: flex; justify-content: space-between; color: #000; align-items: center; width: 100%; padding: 1rem; box-sizing: border-box; }
        .DaywiseItinearyDivReverse { flex-direction: row-reverse; column-gap: 20px; }
        .DaywiseItinearyDivleft { width: 80%; display: flex; flex-direction: column; }
        .dayheader { color: #4a90e2; font-family: "Glacial Indifference", Verdana, sans-serif; text-transform: uppercase; font-weight: bold; }
        .dayDetailsitineary { color: #000; font-family: "Glacial Indifference", Arial, sans-serif; }
        .scenic-image { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="pre size-a4">
        <!-- Cover Page -->
        <div class="coverpage">
            <div style="text-align: center;">
                <div style="background-color: #000; padding: 2rem; margin: 10rem auto 3rem; font-size: 4.5rem; width: min-content; text-align: center;">
                    ${companyName.toUpperCase()}
                </div>
                <div style="font-size: 1.5rem; color: #000;">
                    Designed For Dreamers<br>Built For Travellers
                </div>
                ${companyEmail ? `<div style="font-size: 1.2rem; color: #000; margin-top: 1rem;">${companyEmail}</div>` : ''}
                ${companyAddress ? `<div style="font-size: 1.2rem; color: #000; margin-top: 0.5rem;">${companyAddress}</div>` : ''}
            </div>
        </div>

        <!-- Package Details -->
        <div class="page-break">
            <div class="page1">
                <div class="page-head">Package Details</div>
                <div class="content-pages">
                    <table style="color: #000;" class="package-table">
                        <tr><th>Destination</th><td>${DestinationName}</td></tr>
                        <tr><th>Name</th><td>${ClientName}</td></tr>
                        <tr><th>No of Pax</th><td>${NoOfPax} Adults</td></tr>
                        <tr><th>Date</th><td>${formatDate(TravelDate)}</td></tr>
                        <tr><th>Duration</th><td>${Days} Days ${Nights} Nights</td></tr>
                    </table>
                    <div class="price-container">
                        <div class="price-box">
                            <div class="price-decoration"></div>
                            <div class="price-text">INR ${(Costs?.TotalCost || 0).toLocaleString('en-IN')}/-</div>
                            <div class="price-label">Total</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Day Wise Itinerary -->
        <div class="page-break">
            <div class="page3">
                <div class="page-head">Day Wise Itinerary</div>
                <div style="padding: 0; position: relative;">
                    <table style="color: #000; font-size: 20px;" class="itinerary-table">
                        ${DetailedItinerary.map((it, idx) => `
                        <tr>
                            <td>${formatDate(it.Date || TravelDate)}</td>
                            <td>Day ${idx + 1}</td>
                            <td>${it.Title || it.Activity || ''}</td>
                        </tr>
                        `).join('')}
                    </table>
                    <div class="scenic-image">
                        <img style="width: 100%; height: 100%; object-fit: cover;" 
                             src="https://media.istockphoto.com/id/1526986072/photo/airplane-flying-over-tropical-sea-at-sunset.jpg?s=612x612&w=0&k=20&c=Ccvg3BqlqsWTT0Mt0CvHlbwCuRjPAIWaCLMKSl3PCks=" 
                             alt="Scenic View" 
                             onerror="this.style.display='none'" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Accommodation -->
        ${Hotels && Hotels.length > 0 ? `
        <div class="page-break">
            <div class="page3" style="color: black; flex-direction: column;">
                <div>
                    <div class="page-head">Accommodation</div>
                    ${Hotels.map((h, index) => `
                    <div class="hotelUni">
                        <div style="width: 23rem; height: 19rem; border-radius: 12px; border: 2px solid; overflow: hidden;">
                            <img style="width: 100%; height: 100%; object-fit: cover;" 
                                 src="${h.ImageUrl || 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/403723109.jpg?k=31c45730620eccd00d1cbf2493d3b3eea89e8dceaeb59bf2f6b9eed606efe63f&o='}" 
                                 alt="Hotel" 
                                 onerror="this.style.display='none'" />
                        </div>
                        <div class="hotelUniRight">
                            <h4 style="color: #4a90e2;">${h.Nights || 1} Night(s) Stay at ${h.City || ''}</h4>
                            <span>Hotel - ${h.Name || ''}</span><br/>
                            <span>Meal - ${(h.Meals || []).join(', ')}</span><br/>
                            <span>Room - ${h.RoomType || ''}</span><br/>
                            <span>Hotel Category - ${h.Category || ''} Star</span><br/><br/>
                            <span style="color: #ff6858;">Check In Date - ${h.CheckInDate || ''}</span><br/>
                            <span style="color: #ff6858;">Check Out Date - ${h.CheckOutDate || ''}</span>
                        </div>
                    </div>
                    `).join('<br>')}
                </div>
            </div>
        </div>
        ` : ''}

        <!-- Detailed Itinerary -->
        ${DetailedItinerary && DetailedItinerary.length > 0 ? `
        <div class="page-break">
            <div class="itinearypage" style="position: relative">
                <div class="page3">
                    <div class="page-head">Detailed Itinerary</div>
                    <div class="itinearyDiv">
                        ${DetailedItinerary.map((it, index) => `
                        <div class="${((index + 1) % 2 === 0) ? 'DaywiseItinearyDiv' : 'DaywiseItinearyDivReverse'}">
                            <div class="DaywiseItinearyDivleft">
                                <div style="display: flex; justify-content: space-between;">
                                    <span class="dayheader">Day ${index + 1} - ${it.Title || it.Activity || ''}</span>
                                </div>
                                <p class="dayDetailsitineary">
                                    ${it.Description ? it.Description.replace(/<br\s*\/?>/gi, ' ').replace(/<p>/gi, '').replace(/<\/p>/gi, '') : ''}
                                </p>
                            </div>
                            <div class="DaywiseItinearyDivRight">
                                <img src="${it.ImageUrl || 'https://via.placeholder.com/200'}" 
                                     style="width: 14rem; height: 14rem; border-radius: 50%; object-fit: cover; object-position: center;" 
                                     alt="${it.Title || it.Activity || 'Activity Image'}" 
                                     onerror="this.style.display='none'" />
                            </div>
                        </div>
                        ${index < DetailedItinerary.length - 1 ? '<hr style="margin: 2rem 0; border: 1px solid #ddd;">' : ''}
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
        ` : ''}

        <!-- Inclusions & Exclusions -->
        <div class="page-break">
            <div class="itinearypage" style="position: relative;">
                <div class="page3">
                    <div class="page-head">Inclusions</div>
                    <div class="itinearyDiv">
                        <ul>
                            ${Inclusions.map(inc => `<li style="color: black;">${inc.item || inc}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="page-head">Exclusions</div>
                    <div class="itinearyDiv">
                        <ul>
                            ${Exclusions.map(exc => `<li style="color: black;">${exc.item || exc}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
};
