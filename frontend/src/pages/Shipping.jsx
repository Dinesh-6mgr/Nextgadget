import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../redux/slices/cartSlice';
import { MapPin, ArrowRight, Truck, CheckCircle2 } from 'lucide-react';

const ADDRESS_DATA = {
  Koshi: {
    Jhapa: ['Mechinagar Municipality','Damak Municipality','Birtamod Municipality','Kankai Municipality'],
    Morang: ['Biratnagar Metropolitan City','Sundarharaicha Municipality','Pathari-Shanischare Municipality'],
  },
  Madhesh: {
    Saptari: ['Rajbiraj Municipality','Kanchanrup Municipality','Dakneshwori Municipality'],
    Dhanusha: ['Janakpurdham Sub-Metropolitan City','Mithila Municipality','Ganeshman Charnath Municipality'],
  },
  Bagmati: {
    Kathmandu: ['Kathmandu Metropolitan City','Kirtipur Municipality','Tokha Municipality'],
    Lalitpur: ['Lalitpur Metropolitan City','Godawari Municipality','Mahalaxmi Municipality'],
  },
  Gandaki: {
    Kaski: ['Pokhara Metropolitan City','Annapurna Rural Municipality','Machhapuchchhre Rural Municipality'],
    Nawalpur: ['Devchuli Municipality','Kawasoti Municipality','Madhyabindu Municipality','Binayi Triveni Rural Municipality','Bulingtar Rural Municipality','Hupsekot Rural Municipality','Baudikali Rural Municipality','Gaindakot Municipality'],
  },
  Lumbini: {
    Rupandehi: ['Siddharthanagar Municipality','Butwal Sub-Metropolitan City','Tilottama Municipality'],
    Dang: ['Ghorahi Sub-Metropolitan City','Tulsipur Sub-Metropolitan City','Lamahi Municipality'],
  },
  Karnali: {
    Surkhet: ['Birendranagar Municipality','Bheriganga Municipality','Gurbhakot Municipality'],
    Jumla: ['Chandannath Municipality','Tila Rural Municipality','Tatopani Rural Municipality'],
  },
  Sudurpashchim: {
    Kailali: ['Dhangadhi Sub-Metropolitan City','Tikapur Municipality','Ghodaghodi Municipality'],
    Kanchanpur: ['Bhimdatta Municipality','Punarbas Municipality','Krishnapur Municipality'],
  },
};

const selectClass = 'w-full bg-[#070B14] border border-white/10 rounded-xl py-3.5 px-4 text-textMain text-sm focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
const labelClass = 'block text-[10px] font-black text-textSecondary uppercase tracking-[0.2em] mb-2 ml-1';

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingAddress } = useSelector((state) => state.cart);

  const [province, setProvince] = useState(shippingAddress.province || '');
  const [district, setDistrict] = useState(shippingAddress.district || '');
  const [municipality, setMunicipality] = useState(shippingAddress.municipality || '');
  const [ward, setWard] = useState(shippingAddress.ward || '');
  const [tole, setTole] = useState(shippingAddress.tole || '');
  const [wardError, setWardError] = useState('');

  const districts = province ? Object.keys(ADDRESS_DATA[province]) : [];
  const municipalities = province && district ? ADDRESS_DATA[province][district] : [];

  const handleProvince = (e) => {
    setProvince(e.target.value);
    setDistrict('');
    setMunicipality('');
  };

  const handleDistrict = (e) => {
    setDistrict(e.target.value);
    setMunicipality('');
  };

  const handleWard = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setWard(val);
    setWardError(val === '' ? 'Ward must be a number' : '');
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!/^[0-9]+$/.test(ward)) {
      setWardError('Ward must contain numbers only');
      return;
    }
    dispatch(saveShippingAddress({ province, district, municipality, ward, tole,
      // keep legacy fields for PlaceOrder display
      address: `${tole}, Ward ${ward}`,
      city: municipality,
      postalCode: '',
      country: `${district}, ${province}`,
    }));
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 px-4 flex justify-center items-start">
      <div className="max-w-xl w-full">

        {/* Progress */}
        <div className="flex items-center justify-between mb-12 relative px-4">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/5 -z-10 -translate-y-1/2 rounded-full" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black shadow-glow">1</div>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Shipping</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-dark border border-white/10 flex items-center justify-center text-textSecondary font-black">2</div>
            <span className="text-[10px] font-black text-textSecondary uppercase tracking-widest">Payment</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-dark border border-white/10 flex items-center justify-center text-textSecondary font-black">3</div>
            <span className="text-[10px] font-black text-textSecondary uppercase tracking-widest">Summary</span>
          </div>
        </div>

        <div className="card-dark p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10" />

          <div className="mb-8">
            <h1 className="text-3xl font-black mb-2 flex items-center gap-3 text-textMain">
              <Truck className="h-8 w-8 text-secondary" />
              Shipping Address
            </h1>
            <p className="text-textSecondary text-sm italic">Where should we deliver your gadgets?</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-5">

            {/* Province */}
            <div>
              <label className={labelClass}>Province</label>
              <div className="relative">
                <select value={province} onChange={handleProvince} required className={selectClass}>
                  <option value="">Select Province</option>
                  {Object.keys(ADDRESS_DATA).map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <MapPin className="absolute right-4 top-3.5 h-4 w-4 text-textSecondary pointer-events-none" />
              </div>
            </div>

            {/* District */}
            <div>
              <label className={labelClass}>District</label>
              <div className="relative">
                <select value={district} onChange={handleDistrict} required disabled={!province} className={selectClass}>
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <MapPin className="absolute right-4 top-3.5 h-4 w-4 text-textSecondary pointer-events-none" />
              </div>
            </div>

            {/* Municipality */}
            <div>
              <label className={labelClass}>Municipality / Rural Municipality</label>
              <div className="relative">
                <select value={municipality} onChange={(e) => setMunicipality(e.target.value)} required disabled={!district} className={selectClass}>
                  <option value="">Select Municipality</option>
                  {municipalities.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <MapPin className="absolute right-4 top-3.5 h-4 w-4 text-textSecondary pointer-events-none" />
              </div>
            </div>

            {/* Ward + Tole */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Ward No.</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={ward}
                  onChange={handleWard}
                  required
                  placeholder="e.g. 4"
                  className="w-full bg-[#070B14] border border-white/10 rounded-xl py-3.5 px-4 text-textMain text-sm focus:outline-none focus:border-primary transition-all placeholder:text-textSecondary/40"
                />
                {wardError && <p className="text-red-400 text-[10px] font-bold mt-1.5 ml-1">{wardError}</p>}
              </div>
              <div>
                <label className={labelClass}>Tole / Street</label>
                <input
                  type="text"
                  value={tole}
                  onChange={(e) => setTole(e.target.value)}
                  required
                  placeholder="e.g. Newroad"
                  className="w-full bg-[#070B14] border border-white/10 rounded-xl py-3.5 px-4 text-textMain text-sm focus:outline-none focus:border-primary transition-all placeholder:text-textSecondary/40"
                />
              </div>
            </div>

            {/* Preview */}
            {province && district && municipality && ward && tole && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-textSecondary font-bold leading-relaxed">
                  {tole}, Ward {ward}, {municipality}, {district}, {province}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-black py-5 rounded-2xl transition-all shadow-glow flex items-center justify-center gap-3 group tracking-widest text-lg uppercase active:scale-95 mt-2"
            >
              Confirm Address
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
