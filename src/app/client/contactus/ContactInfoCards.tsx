import { Mail, Phone, MapPin } from "lucide-react";

export function EmailCard() {
  return (
    <div className="bg-stone-950 rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-100 mb-1">Email Us</h3>
          <p className="text-gray-400 text-sm mb-2">Send us an email anytime</p>
          <a
            href="mailto:gdg@vishnu.edu.in"
            className="text-blue-600 hover:underline font-medium"
          >
            gdg@vishnu.edu.in
          </a>
        </div>
      </div>
    </div>
  );
}



export function LocationCard() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-900">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-red-100 rounded-lg">
          <MapPin className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Visit Us</h3>
          <p className="text-gray-600 text-sm">
            Vishnu Institute of Technology
            <br />
            Bhimavaram, Andhra Pradesh
            <br />
            India - 534202
          </p>
        </div>
      </div>
    </div>
  );
}
