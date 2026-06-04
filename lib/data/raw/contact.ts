import { Mail, MapPin, Phone } from "lucide-react";
import company from "./company";

const contacts = [
  {
    icon : Mail,
    label: "Email",
    value1: company.info.email,
    value2: "support@tatglobal.com",
  },
  {
    icon: Phone,
    label: "Téléphone",
    value1: company.info.phone,
    value2: "Lun-Ven 9h-18h",
  },
  {
    icon: MapPin,
    label: "Adresse",
    value1: company.info.address,
    value2: company.info.city + " " + company.info.country,
  },
];


export default contacts