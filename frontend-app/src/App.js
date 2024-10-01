import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    bloodEar: 'no',
    bloodNose: 'no',
    bloodAnus: 'no',
    bloodBrown: 'no',
    bloodCoffee: 'no',
    bloodMouth: 'no',
    bloodPenis: 'yes',
    bloodVagina: 'yes',
    cerebrospinal: 'no',
    deafness: 'no',
    earAche: 'yes',
    headAche: 'no',
    vomiting: 'no',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form data", formData);
      const response = await axios.post('http://localhost:8080/api/evidences/submit', formData);
      alert(response.data);
    } catch (error) {
      console.error("There was an error submitting the form!", error);
    }
  };

  return (
    <div>
  <h1>Submit Evidences</h1>
  <form onSubmit={handleSubmit}>
    <label>Blood from Ear:
      <select name="bloodEar" value={formData.bloodEar} onChange={handleChange}>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </label><br/>

    <label>Blood from Nose:
      <select name="bloodNose" value={formData.bloodNose} onChange={handleChange}>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </label><br/>

    <label>Blood from Anus:
      <select name="bloodAnus" value={formData.bloodAnus} onChange={handleChange}>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </label><br/>

    <label>Blood Brown:
      <select name="bloodBrown" value={formData.bloodBrown} onChange={handleChange}>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </label><br/>

    <label>Blood Coffee:
      <select name="bloodCoffee" value={formData.bloodCoffee} onChange={handleChange}>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </label><br/>

    <label>Blood from Mouth:
      <select name="bloodMouth" value={formData.bloodMouth} onChange={handleChange}>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </label><br/>

    <label>Blood from Penis:
      <select name="bloodPenis" value={formData.bloodPenis} onChange={handleChange}>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </label><br/>

    <label>Blood from Vagina:
      <select name="bloodVagina" value={formData.bloodVagina} onChange={handleChange}>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </label><br/>

    <label>Cerebrospinal Fluid:
      <select name="cerebrospinal" value={formData.cerebrospinal} onChange={handleChange}>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </label><br/>

    <label>Deafness:
      <select name="deafness" value={formData.deafness} onChange={handleChange}>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </label><br/>

    <label>Ear Ache:
      <select name="earAche" value={formData.earAche} onChange={handleChange}>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </label><br/>

    <label>Headache:
      <select name="headAche" value={formData.headAche} onChange={handleChange}>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </label><br/>

    <label>Vomiting:
      <select name="vomiting" value={formData.vomiting} onChange={handleChange}>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </label><br/>

    <button type="submit">Submit</button>
  </form>
</div>
  );
}

export default App;
