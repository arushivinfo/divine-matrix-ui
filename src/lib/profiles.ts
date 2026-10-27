export interface City {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export const CITIES: City[] = [
  { id: "mhow", name: "Mhow (Indore)", lat: 22.5553, lon: 75.722 },
  { id: "indore", name: "Indore", lat: 22.7196, lon: 75.8577 },
  { id: "delhi", name: "Delhi", lat: 28.6139, lon: 77.209 },
  { id: "mumbai", name: "Mumbai", lat: 19.076, lon: 72.8777 },
  { id: "jaipur", name: "Jaipur", lat: 26.9124, lon: 75.7873 },
  { id: "kolkata", name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { id: "chennai", name: "Chennai", lat: 13.0827, lon: 80.2707 },
  { id: "bengaluru", name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
  { id: "ahmedabad", name: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
  { id: "lucknow", name: "Lucknow", lat: 26.8467, lon: 80.9462 },
  { id: "varanasi", name: "Varanasi", lat: 25.3176, lon: 82.9739 },
  { id: "chandigarh", name: "Chandigarh", lat: 30.7333, lon: 76.7794 },
  { id: "surat", name: "Surat", lat: 21.1702, lon: 72.8311 },
  { id: "hyderabad", name: "Hyderabad", lat: 17.385, lon: 78.4867 },
  { id: "bhopal", name: "Bhopal", lat: 23.2599, lon: 77.4126 },
  { id: "sahelwara", name: "Sahelwara (Pipariya, Narmadapuram)", lat: 22.7552, lon: 78.3582 },
  { id: "kanpur", name: "Kanpur", lat: 26.4499, lon: 80.3319 },
  { id: "coimbatore", name: "Coimbatore", lat: 11.0168, lon: 76.9558 },
  { id: "nagpur", name: "Nagpur", lat: 21.1458, lon: 79.0882 },
  { id: "jabalpur", name: "Jabalpur", lat: 23.1815, lon: 79.9864 },
  { id: "udaipur", name: "Udaipur", lat: 24.5854, lon: 73.7125 },
  { id: "agra", name: "Agra", lat: 27.1767, lon: 78.0081 },
  { id: "kochi", name: "Kochi", lat: 9.9312, lon: 76.2673 },
  { id: "goa", name: "Goa", lat: 15.2993, lon: 74.124 },
  { id: "srinagar", name: "Srinagar", lat: 34.0837, lon: 74.7973 },
  { id: "amritsar", name: "Amritsar", lat: 31.634, lon: 74.8723 },
  { id: "patna", name: "Patna", lat: 25.6093, lon: 85.1376 },
  { id: "ranchi", name: "Ranchi", lat: 23.3441, lon: 85.3096 },
  { id: "bhubaneswar", name: "Bhubaneswar", lat: 20.2961, lon: 85.8245 },
  { id: "guwahati", name: "Guwahati", lat: 26.1445, lon: 91.7362 },
  { id: "gangtok", name: "Gangtok", lat: 27.3314, lon: 88.6138 },
  { id: "dehradun", name: "Dehradun", lat: 30.3165, lon: 78.0322 },
  { id: "dharamshala", name: "Dharamshala", lat: 32.219, lon: 76.3234 },
];

export const cityById = (id: string) => CITIES.find((c) => c.id === id) ?? CITIES[0];

export interface Profile {
  id: string;
  name: string;
  /** Date of birth, "YYYY-MM-DD" (IST). */
  dob: string;
  /** Time of birth, "HH:MM" (IST). */
  tob: string;
  cityId: string;
}

/** Founder profiles from the original engine, offered as quick starts. */
export const PRESETS: Profile[] = [
  { id: "aarushi", name: "Aarushi", dob: "2003-10-23", tob: "01:13", cityId: "mhow" },
  { id: "samriddhi", name: "Samriddhi", dob: "2005-12-23", tob: "09:05", cityId: "mhow" },
  { id: "shikha", name: "Shikha", dob: "1977-07-16", tob: "11:20", cityId: "bhopal" },
  { id: "gajendra", name: "Gajendra", dob: "1973-01-22", tob: "13:00", cityId: "sahelwara" },
];

export function birthInput(p: Profile) {
  const city = cityById(p.cityId);
  return { dob: p.dob, tob: p.tob, lat: city.lat, lon: city.lon };
}
