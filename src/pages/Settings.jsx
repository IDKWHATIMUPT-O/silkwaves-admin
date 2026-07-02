import { useEffect, useState } from "react";

export default function Settings() {

  const [settings, setSettings] = useState({

    companyName: "",

    gstNumber: "",

    email: "",

    phone: "",

    warehouseName: "",

    address: "",

    city: "",

    state: "",

    pincode: "",

    country: "India",

    packageWeight: "0.5",

    packageLength: "30",

    packageBreadth: "25",

    packageHeight: "8"

  });
useEffect(() => {

  async function loadSettings() {

    try {

      const res = await fetch(

        `${import.meta.env.VITE_API_BASE_URL}/setting`

      );

      const data = await res.json();

      setSettings(data);

    }

    catch (err) {

      console.log(err);

    }

  }

  loadSettings();

}, []);
  function update(field, value) {

    setSettings(current => ({

      ...current,

      [field]: value

    }));

  }

  async function saveSettings() {

  try {

    const res = await fetch(

      `${import.meta.env.VITE_API_BASE_URL}/setting`,

      {

        method: "POST",

        headers: {

          "Content-Type": "application/json"

        },

        body: JSON.stringify(settings)

      }

    );

    if (!res.ok) {

      throw new Error("Failed to save");

    }

    alert("Settings Saved");

  }

  catch (err) {

    alert(err.message);

  }

}

  return (

    <div>

      <span className="eyebrow">

        COMPANY SETTINGS

      </span>

      <h1>

        Settings

      </h1>

      <div className="form-grid">

        <input
          placeholder="Company Name"
          value={settings.companyName}
          onChange={(e)=>update("companyName",e.target.value)}
        />

        <input
          placeholder="GST Number"
          value={settings.gstNumber}
          onChange={(e)=>update("gstNumber",e.target.value)}
        />

        <input
          placeholder="Email"
          value={settings.email}
          onChange={(e)=>update("email",e.target.value)}
        />

        <input
          placeholder="Phone"
          value={settings.phone}
          onChange={(e)=>update("phone",e.target.value)}
        />

        <input
          placeholder="Warehouse Name"
          value={settings.warehouseName}
          onChange={(e)=>update("warehouseName",e.target.value)}
        />

        <textarea
          placeholder="Pickup Address"
          value={settings.address}
          onChange={(e)=>update("address",e.target.value)}
        />

        <input
          placeholder="City"
          value={settings.city}
          onChange={(e)=>update("city",e.target.value)}
        />

        <input
          placeholder="State"
          value={settings.state}
          onChange={(e)=>update("state",e.target.value)}
        />

        <input
          placeholder="Pincode"
          value={settings.pincode}
          onChange={(e)=>update("pincode",e.target.value)}
        />

        <button onClick={saveSettings}>

          Save Settings

        </button>

      </div>

    </div>

  );

}