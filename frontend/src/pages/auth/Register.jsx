import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', confirmPassword:'', role:'user' });
  const [userData, setUserData] = useState({ age:'', gender:'', bloodGroup:'', address:'', defaultEmergencyMsg:'Help! I am in danger. Please reach out.', emergencyContacts:[{name:'',phone:'',relation:''}] });
  const [volunteerData, setVolunteerData] = useState({ age:'', skills:[], experience:'', referenceName:'', referencePhone:'', hasVehicle:false, vehicleType:'', availableSlots:[] });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const addContact = () => { if(userData.emergencyContacts.length<5) setUserData({...userData,emergencyContacts:[...userData.emergencyContacts,{name:'',phone:'',relation:''}]}); };
  const updateContact = (i,f,v) => { const u=[...userData.emergencyContacts]; u[i][f]=v; setUserData({...userData,emergencyContacts:u}); };
  const removeContact = (i) => setUserData({...userData,emergencyContacts:userData.emergencyContacts.filter((_,idx)=>idx!==i)});
  const toggleSkill = (s) => { if(volunteerData.skills.includes(s)) setVolunteerData({...volunteerData,skills:volunteerData.skills.filter(x=>x!==s)}); else setVolunteerData({...volunteerData,skills:[...volunteerData.skills,s]}); };
  const addSlot = () => setVolunteerData({...volunteerData,availableSlots:[...volunteerData.availableSlots,'']});
  const updateSlot = (i,v) => { const s=[...volunteerData.availableSlots]; s[i]=v; setVolunteerData({...volunteerData,availableSlots:s}); };
  const removeSlot = (i) => setVolunteerData({...volunteerData,availableSlots:volunteerData.availableSlots.filter((_,idx)=>idx!==i)});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(form.phone.length!==10){toast.error('Phone must be 10 digits');return;}
    if(form.password.length<6){toast.error('Password must be at least 6 characters');return;}
    if(form.password!==form.confirmPassword){toast.error('Passwords do not match!');return;}
    if(form.role==='user'){
      if(!userData.age||userData.age<1){toast.error('Please enter valid age');return;}
      if(!userData.gender){toast.error('Please select gender');return;}
      if(!userData.address){toast.error('Address is required');return;}
      for(let c of userData.emergencyContacts){
        if(!c.name||!c.phone||!c.relation){toast.error('All emergency contact fields required');return;}
        if(c.phone.length!==10){toast.error('Emergency contact phone must be 10 digits');return;}
      }
    }
    if(form.role==='volunteer'){
      if(!volunteerData.age||volunteerData.age<18){toast.error('Volunteer must be 18+');return;}
      if(!volunteerData.referenceName||!volunteerData.referencePhone){toast.error('Reference contact required');return;}
      if(volunteerData.skills.length===0){toast.error('Select at least one skill');return;}
      if(volunteerData.hasVehicle&&!volunteerData.vehicleType){toast.error('Please specify vehicle type');return;}
    }
    setLoading(true);
    try {
      await register({ name:form.name, email:form.email, phone:form.phone, password:form.password, role:form.role, userData:form.role==='user'?userData:undefined, volunteerData:form.role==='volunteer'?volunteerData:undefined });
      toast.success('Account created successfully!');
      if(form.role==='volunteer') navigate('/volunteer');
      else navigate('/dashboard');
    } catch(err){ toast.error(err.response?.data?.message||'Registration failed'); }
    finally{ setLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .rp{min-height:100vh;display:flex;font-family:'Poppins',sans-serif;background:#fff;}
        .rl{flex:1;background:linear-gradient(135deg,#e8f5e9 0%,#c8e6c9 30%,#e8d5f5 70%,#d4b8f0 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;position:sticky;top:0;height:100vh;overflow:hidden;}
        .rl::before{content:'';position:absolute;width:400px;height:400px;background:rgba(255,255,255,0.2);border-radius:50%;top:-100px;left:-100px;}
        .rl::after{content:'';position:absolute;width:300px;height:300px;background:rgba(255,255,255,0.15);border-radius:50%;bottom:-80px;right:-80px;}
        .rb{display:flex;align-items:center;gap:10px;position:absolute;top:30px;left:30px;z-index:2;font-size:15px;font-weight:700;color:#2e7d32;}
        .ri{position:relative;z-index:2;width:100%;max-width:360px;}
        .fb{position:absolute;background:white;border-radius:50px;padding:10px 18px;display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:#333;box-shadow:0 4px 20px rgba(0,0,0,0.1);z-index:3;animation:fa 3s ease-in-out infinite;}
        .fb1{top:22%;right:6%;}
        .fb2{top:36%;right:6%;animation-delay:.5s;}
        .ff{position:absolute;animation:fa 4s ease-in-out infinite;z-index:3;}
        .ff1{bottom:25%;right:10%;font-size:24px;}
        .ff2{bottom:38%;left:8%;font-size:16px;animation-delay:1s;}
        .ff3{top:22%;left:6%;font-size:20px;animation-delay:2s;}
        .fs{bottom:14%;left:10%;font-size:32px;animation-delay:.5s;}
        @keyframes fa{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        .rr{width:540px;display:flex;align-items:flex-start;justify-content:center;padding:40px 50px;background:#fff;overflow-y:auto;max-height:100vh;}
        .rfb{width:100%;padding-bottom:20px;}
        .rt{font-size:32px;font-weight:700;color:#1a1a2e;margin-bottom:6px;}
        .rs{font-size:14px;color:#999;margin-bottom:28px;}
        .ig{position:relative;margin-bottom:14px;}
        .ii{position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:16px;color:#bbb;}
        .in{width:100%;padding:13px 16px 13px 46px;border:1.5px solid #ebebeb;border-radius:12px;font-size:14px;font-family:'Poppins',sans-serif;color:#333;background:#fafafa;outline:none;transition:all 0.2s;}
        .in:focus{border-color:#4caf50;background:#fff;box-shadow:0 0 0 3px rgba(76,175,80,0.1);}
        .ie{position:absolute;right:16px;top:50%;transform:translateY(-50%);cursor:pointer;color:#bbb;font-size:16px;background:none;border:none;padding:0;}
        .ros{margin-bottom:20px;}
        .rol{font-size:11px;font-weight:700;color:#999;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;display:block;}
        .rob{display:flex;gap:10px;}
        .rbn{flex:1;padding:12px 8px;border-radius:12px;border:2px solid #ebebeb;background:#fafafa;font-size:13px;font-weight:600;color:#888;cursor:pointer;transition:all 0.2s;font-family:'Poppins',sans-serif;}
        .rbn.act{border-color:#4caf50;background:#f1f8e9;color:#2e7d32;}
        .sd{border-top:1px solid #f0f0f0;margin:20px 0 16px;padding-top:16px;}
        .sh{font-size:14px;font-weight:600;color:#2e7d32;margin-bottom:14px;display:flex;align-items:center;gap:6px;}
        .ei{width:100%;padding:12px 16px;border:1.5px solid #ebebeb;border-radius:12px;font-size:14px;font-family:'Poppins',sans-serif;background:#fafafa;outline:none;transition:all 0.2s;margin-bottom:12px;color:#333;}
        .ei:focus{border-color:#4caf50;}
        .ec{background:#f8fff8;border:1px solid #e8f5e9;padding:14px;border-radius:12px;margin-bottom:12px;}
        .ec .ei{margin-bottom:8px;}
        .sb{background:none;border:1.5px solid #ddd;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer;font-family:'Poppins',sans-serif;color:#666;margin-top:8px;transition:all 0.2s;}
        .rmb{background:none;border:1.5px solid #ffcdd2;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer;font-family:'Poppins',sans-serif;color:#e53935;margin-top:8px;}
        .sw{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;}
        .skb{padding:8px 16px;border-radius:40px;background:#f0f2f5;border:1.5px solid #e0e0e0;cursor:pointer;font-size:13px;font-family:'Poppins',sans-serif;color:#555;transition:all 0.2s;}
        .skb.sel{background:#4caf50;color:white;border-color:#4caf50;}
        .r2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
        .cl{display:flex;align-items:center;gap:8px;font-size:13px;color:#555;cursor:pointer;margin-bottom:12px;}
        .cl input{width:16px;height:16px;accent-color:#4caf50;}
        .rbtn{width:100%;padding:15px;background:linear-gradient(135deg,#4caf50,#2e7d32);color:white;border:none;border-radius:12px;font-size:16px;font-weight:600;font-family:'Poppins',sans-serif;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 20px rgba(76,175,80,0.35);margin-top:20px;margin-bottom:18px;}
        .rbtn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 28px rgba(76,175,80,0.45);}
        .rbtn:disabled{opacity:0.7;cursor:not-allowed;}
        .ll{text-align:center;font-size:13px;color:#999;}
        .ll a{color:#4caf50;font-weight:600;text-decoration:none;}
        @media(max-width:900px){.rl{display:none}.rr{width:100%;padding:30px 24px;max-height:none}}
      `}</style>

      <div className="rp">
        <div className="rl">
          <div className="rb">🛡️ Women Safety Emergency Platform 💚</div>
          <div className="fb fb1">🔒 Secure Registration <span style={{color:'#4caf50'}}>✓</span></div>
          <div className="fb fb2">💚 Join Our Network <span style={{color:'#4caf50'}}>✓</span></div>
          <div className="ff ff1">⭐</div><div className="ff ff2">✨</div><div className="ff ff3">💫</div><div className="ff fs">🛡️</div>
          <div className="ri">
            <svg viewBox="0 0 400 450" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="230" r="180" fill="rgba(255,255,255,0.3)"/>
              <ellipse cx="200" cy="365" rx="72" ry="30" fill="#c8e6c9" opacity="0.6"/>
              <path d="M150 285 Q200 325 250 285 L265 382 Q200 402 135 382 Z" fill="#4caf50" opacity="0.85"/>
              <rect x="163" y="218" width="74" height="78" rx="12" fill="#2e7d32"/>
              <path d="M163 238 Q125 262 112 295" stroke="#a5d6a7" strokeWidth="20" strokeLinecap="round" fill="none"/>
              <path d="M237 238 Q275 262 288 295" stroke="#a5d6a7" strokeWidth="20" strokeLinecap="round" fill="none"/>
              <circle cx="200" cy="172" r="58" fill="#ffcc80"/>
              <path d="M145 158 Q147 105 200 100 Q253 105 255 158 Q242 127 200 122 Q158 127 145 158 Z" fill="#5d4037"/>
              <ellipse cx="200" cy="102" rx="56" ry="20" fill="#5d4037"/>
              <path d="M255 140 Q280 160 275 200" stroke="#5d4037" strokeWidth="18" strokeLinecap="round" fill="none"/>
              <circle cx="182" cy="176" r="7" fill="#fff"/><circle cx="218" cy="176" r="7" fill="#fff"/>
              <circle cx="184" cy="178" r="3.5" fill="#222"/><circle cx="220" cy="178" r="3.5" fill="#222"/>
              <path d="M184 200 Q200 218 216 200" stroke="#e91e8c" strokeWidth="3" strokeLinecap="round" fill="none"/>
              <circle cx="172" cy="192" r="10" fill="#ffb3c6" opacity="0.5"/>
              <circle cx="228" cy="192" r="10" fill="#ffb3c6" opacity="0.5"/>
              <path d="M258 270 Q276 265 278 267 Q292 280 278 300 Q269 308 258 311 Q247 308 238 300 Q224 280 238 267 Z" fill="#4caf50" opacity="0.9"/>
              <text x="258" y="295" textAnchor="middle" fontSize="15" fill="white">✓</text>
              <circle cx="117" cy="295" r="18" fill="#4caf50" opacity="0.8"/>
              <text x="117" y="301" textAnchor="middle" fontSize="18" fill="white">+</text>
              <rect x="177" y="378" width="19" height="52" rx="9" fill="#ffcc80"/>
              <rect x="204" y="378" width="19" height="52" rx="9" fill="#ffcc80"/>
              <ellipse cx="186" cy="428" rx="17" ry="8" fill="#2e7d32"/>
              <ellipse cx="213" cy="428" rx="17" ry="8" fill="#2e7d32"/>
            </svg>
          </div>
        </div>

        <div className="rr">
          <div className="rfb">
            <h1 className="rt">Create Account</h1>
            <p className="rs">Join the SafeGuard network today</p>
            <form onSubmit={handleSubmit}>
              <div className="ig"><span className="ii">👤</span><input className="in" type="text" placeholder="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></div>
              <div className="ig"><span className="ii">✉️</span><input className="in" type="email" placeholder="Email Address" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/></div>
              <div className="ig"><span className="ii">📞</span><input className="in" type="tel" placeholder="10-digit Phone Number" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value.replace(/\D/g,'').slice(0,10)})} required/></div>
              <div className="ig"><span className="ii">🔒</span><input className="in" type={showPassword?'text':'password'} placeholder="Password (min 6 characters)" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/><button type="button" className="ie" onClick={()=>setShowPassword(!showPassword)}>{showPassword?'🙈':'👁️'}</button></div>
              <div className="ig"><span className="ii">🔐</span><input className="in" type={showPassword?'text':'password'} placeholder="Confirm Password" value={form.confirmPassword} onChange={e=>setForm({...form,confirmPassword:e.target.value})} required/></div>

              <div className="ros">
                <span className="rol">I am registering as</span>
                <div className="rob">
                  <button type="button" className={`rbn ${form.role==='user'?'act':''}`} onClick={()=>setForm({...form,role:'user'})}>👤 User</button>
                  <button type="button" className={`rbn ${form.role==='volunteer'?'act':''}`} onClick={()=>setForm({...form,role:'volunteer'})}>🤝 Volunteer</button>
                </div>
              </div>

              {form.role==='user' && (
                <div className="sd">
                  <div className="sh">🛡️ Personal Information</div>
                  <div className="r2">
                    <input className="ei" type="number" placeholder="Age" min="1" max="120" value={userData.age} onChange={e=>setUserData({...userData,age:e.target.value})}/>
                    <select className="ei" value={userData.gender} onChange={e=>setUserData({...userData,gender:e.target.value})}>
                      <option value="">Select Gender</option>
                      <option>Female</option><option>Male</option><option>Other</option>
                    </select>
                  </div>
                  <select className="ei" value={userData.bloodGroup} onChange={e=>setUserData({...userData,bloodGroup:e.target.value})}>
                    <option value="">Blood Group (optional)</option>
                    {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg=><option key={bg}>{bg}</option>)}
                  </select>
                  <textarea className="ei" rows="2" placeholder="Full Address" value={userData.address} onChange={e=>setUserData({...userData,address:e.target.value})} style={{resize:'none'}}/>

                  <div className="sh" style={{marginTop:8}}>📞 Emergency Contacts</div>
                  {userData.emergencyContacts.map((c,i)=>(
                    <div key={i} className="ec">
                      <input className="ei" placeholder="Contact Name" value={c.name} onChange={e=>updateContact(i,'name',e.target.value)}/>
                      <input className="ei" placeholder="Phone (10 digits)" value={c.phone} onChange={e=>updateContact(i,'phone',e.target.value.replace(/\D/g,'').slice(0,10))}/>
                      <select className="ei" value={c.relation} onChange={e=>updateContact(i,'relation',e.target.value)}>
                        <option value="">Select Relation</option>
                        {['family','friend','colleague','neighbor','other'].map(r=><option key={r} value={r}>{r}</option>)}
                      </select>
                      {userData.emergencyContacts.length>1 && <button type="button" className="rmb" onClick={()=>removeContact(i)}>✕ Remove</button>}
                    </div>
                  ))}
                  {userData.emergencyContacts.length<5 && <button type="button" className="sb" onClick={addContact}>+ Add Emergency Contact</button>}

                  <div className="sh" style={{marginTop:16}}>✏️ Default Emergency Message</div>
                  <textarea className="ei" rows="2" value={userData.defaultEmergencyMsg} onChange={e=>setUserData({...userData,defaultEmergencyMsg:e.target.value})} style={{resize:'none'}}/>
                </div>
              )}

              {form.role==='volunteer' && (
                <div className="sd">
                  <div className="sh">🪪 Basic Details</div>
                  <input className="ei" type="number" placeholder="Age (18+ only)" min="18" value={volunteerData.age} onChange={e=>setVolunteerData({...volunteerData,age:e.target.value})}/>
                  <div className="sh">👥 Reference Contact</div>
                  <div className="r2">
                    <input className="ei" placeholder="Reference Name" value={volunteerData.referenceName} onChange={e=>setVolunteerData({...volunteerData,referenceName:e.target.value})}/>
                    <input className="ei" placeholder="Reference Phone" value={volunteerData.referencePhone} onChange={e=>setVolunteerData({...volunteerData,referencePhone:e.target.value.replace(/\D/g,'').slice(0,10)})}/>
                  </div>
                  <div className="sh">💪 Skills</div>
                  <div className="sw">
                    {['Medical Help','Self Defense','General Support','Counseling','Transport'].map(s=>(
                      <div key={s} className={`skb ${volunteerData.skills.includes(s)?'sel':''}`} onClick={()=>toggleSkill(s)}>{s}</div>
                    ))}
                  </div>
                  <textarea className="ei" rows="2" placeholder="Experience (optional)" value={volunteerData.experience} onChange={e=>setVolunteerData({...volunteerData,experience:e.target.value})} style={{resize:'none'}}/>
                  <div className="sh">🕐 Availability Slots</div>
                  {volunteerData.availableSlots.map((slot,i)=>(
                    <div key={i} style={{display:'flex',gap:8,marginBottom:8}}>
                      <input className="ei" style={{marginBottom:0}} placeholder="e.g., Mon 10am-2pm" value={slot} onChange={e=>updateSlot(i,e.target.value)}/>
                      <button type="button" className="rmb" style={{marginTop:0,whiteSpace:'nowrap'}} onClick={()=>removeSlot(i)}>✕</button>
                    </div>
                  ))}
                  <button type="button" className="sb" onClick={addSlot}>+ Add Time Slot</button>
                  <div style={{marginTop:16}}>
                    <label className="cl"><input type="checkbox" checked={volunteerData.hasVehicle} onChange={e=>setVolunteerData({...volunteerData,hasVehicle:e.target.checked})}/>I have a vehicle</label>
                    {volunteerData.hasVehicle && (
                      <select className="ei" value={volunteerData.vehicleType} onChange={e=>setVolunteerData({...volunteerData,vehicleType:e.target.value})}>
                        <option value="">Select Vehicle Type</option>
                        <option>Bike</option><option>Car</option><option>Auto</option>
                      </select>
                    )}
                  </div>
                </div>
              )}

              <button type="submit" className="rbtn" disabled={loading}>{loading?'Creating account...':'Create Account'}</button>
            </form>
            <div className="ll">Already have an account? <Link to="/login">Sign in here</Link></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;