// import React, { useMemo } from 'react';
// import { View, ActivityIndicator } from 'react-native';
// import { FormProvider } from 'react-hook-form';
// import SimpleQuotationWrapper from './SimpleQuotationWrapper';
// import BasicDetails from './BasicDetails';
// import CostCalculator from './CostCalculator';
// import HotelsSection from './HotelsSection';
// import InclusionsExclusions from './InclusionsExclusionsNew';
// import FlightSection from './FlightSection';
// import ItinerarySection from './ItinerarySectionNew';

// import { useQuotationDraft } from '@/hooks/useQuotationDraft'; // your AsyncStorage autosave hook
// import { clearQuotationDraft } from '@/storage/quotationDrafts';

// const calculateTravelEndDate = (startDate, days) => {
//   if (!startDate || !days) return '';
//   const start = new Date(startDate);
//   const end = new Date(start.getTime() + (days - 1) * 24 * 60 * 60 * 1000);
//   return end.toISOString().split('T')[0];
// };

// const IntegratedQuotationForm = ({ onSubmit, initialData = {}, lead }) => {
// console.log(lead,'ttttttttttt')
//   const tripId = lead?.TripId || '';
// const userData={
//   CompanyId:'12345',
//   AssignDate: new Date().toISOString(),
//   AssignDateKey: +new Date().toISOString().slice(0,10).replace(/-/g,''),


// }
//   // Build defaults ONCE; changing this object each render causes RHF to rethink everything.
//   const defaults = useMemo(
//     () => ({
//       LeadId:lead?.LeadId,
//       TripId: tripId,
//       "Client-Name": lead?.ClientLeadDetails?.FullName || '',
//       "Client-Contact": lead?.ClientLeadDetails?.Contact || '',
//       "Client-Email": lead?.ClientLeadDetails?.Email || '',
//       TravelDate: lead?.ClientLeadDetails?.TravelDate || '',
//       TravelDateKey: +new Date(lead?.ClientLeadDetails?.TravelDate).toISOString().slice(0,10).replace(/-/g,''),
//       AssignDate: lead?.AssignDate || '',
//       NoOfPax: lead?.ClientLeadDetails?.Pax || '',
//       Child: lead?.ClientLeadDetails?.Child || '',
//       Infant: lead?.ClientLeadDetails?.Infant || '0',
//       Budget: lead?.ClientLeadDetails?.Budget || '',
//       DepartureCity: lead?.ClientLeadDetails?.DepartureCity || '',
//       DestinationName: lead?.ClientLeadDetails?.DestinationName || '',
//       IsMultiDestination: false,
//       Destinations: lead?.ClientLeadDetails?.DestinationName ? [lead?.ClientLeadDetails?.DestinationName] : [],
//       Days: lead?.ClientLeadDetails?.Days === '' ? 2 : +lead?.ClientLeadDetails?.Days,
//       Nights: lead?.ClientLeadDetails?.Days === '' ? 1 : lead?.ClientLeadDetails?.Days - 1,
//       PriceType: 'Total',
//       Currency: 'INR',
//       Costs:{
//        LandPackageCost: 0,
//        VisaCost: 0,
//        FlightCost: 0,
//        GSTAmount: 0,
//        TCSAmount: 0,
//        TotalCost: 0,
//        TotalTax: 0
    
//       },
//       GST: {
//         Enabled: true,
//         WaivedOffAmount: 0,
//         WaivedOffOtps: []
//       },
//       TCS: {
//         Enabled: true,
//         WaivedOffAmount: 0,
//         WaivedOffOtps: []
//       },
//       Images: {
//     Inclusions: [],
//     Flights: []
//   },

//       Hotels: [
//         {
//           Nights:0,
//           Name: '',
//           City: '',
//           RoomType: '',
//           Category: 0,
//           Meals: [],
//           CheckInDate : '',
//           CheckInDateKey:null,
//           CheckOutDate: '',
//           CheckOutDateKey:null,
//           Comments: '',
//         },
//       ],
//       Inclusions: [],
//       Exclusions: [],
//       Itinearies: [
//         {
//           Date: "",
//           DateKey: null,
//           Title: "",
//           Activities: "",
//           ImageUrl: "",
//           Description: "",
//         },
    
//       ],
    
//       CreatedAt: new Date().toISOString(),
//       LastUpdateStatus:{
//         UpdatedBy: 'Draft',
//         UpdatedTime: new Date().toISOString(),
//       },
//       TravelEndDate: calculateTravelEndDate(
//         lead?.ClientLeadDetails?.TravelDate,
//         Number(lead?.ClientLeadDetails?.Days)
//       ),
//       TravelEndDateKey: +new Date(lead?.ClientLeadDetails?.TravelDate).toISOString().slice(0,10).replace(/-/g,''),
//       ...initialData,
//     }),
//     [tripId, lead, initialData]
//   );

//   const { methods, loading } = useQuotationDraft(tripId, defaults);

//   const sections = useMemo(
//     () => [
//       { key: 'basic', Component: BasicDetails },
//       { key: 'cost', Component: CostCalculator },
//       { key: 'hotels', Component: HotelsSection },
//       { key: 'incl-excl', Component: InclusionsExclusions },
//       { key: 'flights', Component: FlightSection },
//       { key: 'itinerary', Component: ItinerarySection },
//     ],
//     []
//   );

//   const handleSubmit = methods.handleSubmit(async (data) => {
//     console.log(data)

//     await onSubmit({...data,...userData});
//     await clearQuotationDraft(tripId); 
//   });

//   if (loading) {
//     return (
//       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <FormProvider {...methods}>
//       {/* IMPORTANT: remove value={formValues} and onChange={...}
//          Sections will read/write through RHF context themselves */}
//       <SimpleQuotationWrapper
//         sections={sections}
//         onSubmit={handleSubmit}
//         header={null}
//         footer={null}
//       />
//     </FormProvider>
//   );
// };

// export default IntegratedQuotationForm;



import React, { useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
import { FormProvider } from "react-hook-form";
import SimpleQuotationWrapper from "./SimpleQuotationWrapper";
import BasicDetails from "./BasicDetails";
import CostCalculator from "./CostCalculator";
import HotelsSection from "./HotelsSection";
import InclusionsExclusions from "./InclusionsExclusionsNew";
import FlightSection from "./FlightSection";
import ItinerarySection from "./ItinerarySectionNew";

import { useQuotationDraft } from "@/hooks/useQuotationDraft";
import { clearQuotationDraft } from "@/storage/quotationDrafts";

const calculateTravelEndDate = (startDate, days) => {
  if (!startDate || !days) return "";
  const start = new Date(startDate);
  const end = new Date(start.getTime() + (days - 1) * 24 * 60 * 60 * 1000);
  return end.toISOString().split("T")[0];
};

const IntegratedQuotationForm = ({ onSubmit, initialData = {}, lead, followUpData }) => {
  console.log("Lead Data:", lead);
  console.log("FollowUp Data:", followUpData);

  const tripId = followUpData?.TripId || lead?.TripId || "";

  const userData = {
    CompanyId: "12345",
    AssignDate: new Date().toISOString(),
    AssignDateKey: +new Date().toISOString().slice(0, 10).replace(/-/g, ""),
  };

  // ------------------ Normalize both structures -------------------
  const sourceData = followUpData || lead;
  const client = followUpData
    ? {
        FullName: followUpData["Client-Name"],
        Contact: followUpData["Client-Contact"],
        Email: followUpData["Client-Email"],
        TravelDate: followUpData.TravelDate,
        Pax: followUpData.NoOfPax,
        Child: followUpData.Child,
        Infant: followUpData.Infant,
        Budget: followUpData.Budget,
        DepartureCity: followUpData.DepartureCity,
        DestinationName: followUpData.DestinationName,
        Destinations: followUpData.Destinations || [followUpData.DestinationName],
        Days: followUpData.Days,
        IsMultiDestination: followUpData.IsMultiDestination,
      }
    : sourceData?.ClientLeadDetails || {};

  // ------------------ Default form values -------------------
  const defaults = useMemo(
    () => ({
      LeadId: sourceData?.LeadId,
      TripId: sourceData?.TripId || "",
      "Client-Name": client?.FullName || "",
      "Client-Contact": client?.Contact || "",
      "Client-Email": client?.Email || "",
      TravelDate: client?.TravelDate || "",
      TravelDateKey: client?.TravelDate
        ? +new Date(client.TravelDate).toISOString().slice(0, 10).replace(/-/g, "")
        : null,
      AssignDate: sourceData?.AssignDate || new Date().toISOString(),
      NoOfPax: client?.Pax || "",
      Child: client?.Child || "0",
      Infant: client?.Infant || "0",
      Budget: client?.Budget || "",
      DepartureCity: client?.DepartureCity || "",
      DestinationName: client?.DestinationName || "",
      IsMultiDestination: client?.IsMultiDestination || false,
      Destinations:
        client?.Destinations || (client?.DestinationName ? [client.DestinationName] : []),
      Days: client?.Days || 2,
      Nights: client?.Days ? client.Days - 1 : 1,
      PriceType: followUpData?.PriceType || "Total",
      Currency: followUpData?.Currency || "INR",
      Costs: followUpData?.Costs || {
        LandPackageCost: 0,
        VisaCost: 0,
        FlightCost: 0,
        GSTAmount: 0,
        TCSAmount: 0,
        TotalCost: 0,
        TotalTax: 0,
      },
      GST: followUpData?.GST || { Enabled: true, WaivedOffAmount: 0, WaivedOffOtps: [] },
      TCS: followUpData?.TCS || { Enabled: true, WaivedOffAmount: 0, WaivedOffOtps: [] },
      Images: followUpData?.Images || { Inclusions: [], Flights: [] },
      Hotels: followUpData?.Hotels || [
        {
          Nights: 0,
          Name: "",
          City: "",
          RoomType: "",
          Category: 0,
          Meals: [],
          CheckInDate: "",
          CheckInDateKey: null,
          CheckOutDate: "",
          CheckOutDateKey: null,
          Comments: "",
        },
      ],
      Inclusions: followUpData?.Inclusions || [],
      Exclusions: followUpData?.Exclusions || [],
      Itinearies: followUpData?.Itinearies || [
        {
          Date: "",
          DateKey: null,
          Title: "",
          Activities: "",
          ImageUrl: "",
          Description: "",
        },
      ],
      CreatedAt: new Date().toISOString(),
      LastUpdateStatus: {
        UpdatedBy: "Draft",
        UpdatedTime: new Date().toISOString(),
      },
      TravelEndDate: calculateTravelEndDate(client?.TravelDate, Number(client?.Days)),
      TravelEndDateKey: client?.TravelDate
        ? +new Date(client.TravelDate).toISOString().slice(0, 10).replace(/-/g, "")
        : null,
      ...initialData,
    }),
    [followUpData?.QuoteId, lead?.TripId, tripId, initialData]
  );

  // ------------------ Hook for autosave draft -------------------
  // Skip loading cached draft when opening existing quotation (followUpData exists)
  // Pass QuoteId as uniqueId to track when quotation changes
  const { methods, loading } = useQuotationDraft(
    tripId, 
    defaults, 
    !!followUpData,
    followUpData?.QuoteId
  );

  const sections = useMemo(
    () => [
      { key: "basic", Component: BasicDetails },
      { key: "cost", Component: CostCalculator },
      { key: "hotels", Component: HotelsSection },
      { key: "incl-excl", Component: InclusionsExclusions },
      { key: "flights", Component: FlightSection },
      { key: "itinerary", Component: ItinerarySection },
    ],
    []
  );

  const handleSubmit = methods.handleSubmit(async (data) => {
    console.log("Form Submit Data:", data);
    await onSubmit({ ...data, ...userData });
    await clearQuotationDraft(tripId);
  });

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FormProvider {...methods}>
      <SimpleQuotationWrapper
        sections={sections}
        onSubmit={handleSubmit}
        header={null}
        footer={null}
      />
    </FormProvider>
  );
};

export default IntegratedQuotationForm;
