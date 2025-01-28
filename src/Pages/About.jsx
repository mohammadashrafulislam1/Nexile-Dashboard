import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { endPoint } from "../Components/ForAll/ForAll";
import Swal from "sweetalert2";

const About = () => {
  const [formData, setFormData] = useState({
    sectionTitle: "",
    sectionDes: "",
    metaTitle: "",
    metaDes: "",
    tagline: "",
    whoWeAre: "",
    ourStory: "",
    ourMission: "",
    ourVision: "",
    coreValues: [{ title: "", description: "" }],
    whyChooseUs: [{ title: "", description: "" }],
    ourImpact: [{ title: "", description: "" }],
  });
  const [loading, setLoading] = useState(false);
  const [storyImage, setStoryImage] = useState(null);
  const [aboutId, setAboutId] = useState('');
  const [missionImage, setMissionImage] = useState(null);
  const [visionImage, setVisionImage] = useState(null);
  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${endPoint}/about`);
      setFormData((prevData) => ({
        ...prevData,
        ...data,
        tagline: data.intro?.tagline || "", 
        whoWeAre: data.intro?.whoWeAre || "", 
        ourStory: data.ourStory?.description || "", 
        ourMission: data.ourMission?.description || "", 
        ourVision: data.ourVision?.description || "", 
      }));
      setAboutId(data._id)
      setStoryImage(data.ourStory?.image?.url)
      setMissionImage(data.ourMission?.image?.url)
      setVisionImage(data.ourVision?.image?.url)
    } catch (error) {
      console.error("Error fetching services:", error);
    }
    finally{
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const deleteField = (index, field) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: prevState[field].filter((_, i) => i !== index),
    }));
  };
  
  const addField = (field) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: [...prevState[field], { title: "", description: "" }],
    }));
  };
  
  const handleNestedChange = (e, index, key, field) => {
    const { value } = e.target;
    setFormData((prevState) => {
      const updatedField = [...prevState[field]];
      updatedField[index] = { ...updatedField[index], [key]: value };
      return { ...prevState, [field]: updatedField };
    });
  };
  

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "coreValues" || key === "whyChooseUs" || key === "ourImpact") {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });

    if (storyImage) data.append("storyImage", storyImage);
    if (missionImage) data.append("missionImage", missionImage);
    if (visionImage) data.append("visionImage", visionImage);
    try {
        
    console.log("aboutId", aboutId)
    {
        formData?.sectionTitle ? await axios.put(`${endPoint}/about/${aboutId}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
          }) : await axios.post(`${endPoint}/about`, data, {
            headers: { "Content-Type": "multipart/form-data" },
          })
    }
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${formData?.sectionTitle ? "About Us updated successfully!" :"About Us added successfully!" }`,
        showConfirmButton: false,
        timer: 1500
      });
      fetchAbout()
      // Reset the form if needed
    //   setFormData({
    //     sectionTitle: "",
    //     sectionDes: "",
    //     metaTitle: "",
    //     metaDes: "",
    //     tagline: "",
    //     whoWeAre: "",
    //     ourStory: "",
    //     ourMission: "",
    //     ourVision: "",
    //     coreValues: [{ title: "", description: "" }],
    //     whyChooseUs: [{ title: "", description: "" }],
    //     ourImpact: [{ title: "", description: "" }],
    //   });
      setStoryImage(null);
      setMissionImage(null);
      setVisionImage(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: `${error?.response?.data?.message ? error?.response?.data?.message :"Failed to submit form"}`,
        showConfirmButton: false,
        timer: 1500
      });
    }
    finally{
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }
  return (
    <div>
    <div className="breadcrumbs text-sm lg:w-1/2 md:w-[80%] w-[90%] mx-auto">
      <ul className="my-6">
        <li>
          <Link to="/" className="inline-flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-4 w-4 stroke-current">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
            </svg>
            Home
          </Link>
        </li>
        <li>
          <span className="inline-flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-4 w-4 stroke-current">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            About Us
          </span>
        </li>
      </ul>
      <ToastContainer />
    </div>
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="p-6 lg:w-1/2 md:w-[80%] w-[96%] mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">About Us Section</h2>
  
      {/* General Information */}
      <label className="block mb-2">Section Title</label>
      <input
        name="sectionTitle"
        placeholder="Section Title"
        value={formData.sectionTitle}
        onChange={handleChange}
        className="input input-bordered w-full mb-4"
      />
  
      <label className="block mb-2">Section Description</label>
      <textarea
        name="sectionDes"
        placeholder="Section Description"
        value={formData.sectionDes}
        onChange={handleChange}
        className="input input-bordered w-full mb-4"
      />
  
      <label className="block mb-2">Meta Title</label>
      <input
        name="metaTitle"
        placeholder="Meta Title"
        value={formData.metaTitle}
        onChange={handleChange}
        className="input input-bordered w-full mb-4"
      />
  
      <label className="block mb-2">Meta Description</label>
      <textarea
        name="metaDes"
        placeholder="Meta Description"
        value={formData.metaDes}
        onChange={handleChange}
        className="input input-bordered w-full mb-4"
      />
  
      {/* Intro */}
      <label className="block mb-2">Tagline</label>
      <input
        name="tagline"
        placeholder="Tagline"
        value={formData.tagline}
        onChange={handleChange}
        className="input input-bordered w-full mb-4"
      />
  
      <label className="block mb-2">Who We Are</label>
      <textarea
        name="whoWeAre"
        placeholder="Who We Are"
        value={formData.whoWeAre}
        onChange={handleChange}
        className="input input-bordered w-full mb-4"
      />
  
      {/* Story, Mission, Vision */}
      <label className="block mb-2">Our Story</label>
      <textarea
        name="ourStory"
        placeholder="Our Story"
        value={formData.ourStory}
        onChange={handleChange}
        className="input input-bordered w-full mb-4"
      />
     {storyImage &&<img src={storyImage} alt={formData?.ourStory} className="w-24 h-24 rounded my-3 object-cover" />} 
      <input type="file" onChange={(e) => setStoryImage(e.target.files[0])} className="mb-4 file-input file-input-bordered w-full" />
  
      <label className="block mb-2">Our Mission</label>
      <textarea
        name="ourMission"
        placeholder="Our Mission"
        value={formData.ourMission}
        onChange={handleChange}
        className="input input-bordered w-full mb-4"
      />
     {missionImage &&<img src={missionImage} alt={formData?.ourMission} className="w-24 h-24 rounded my-3 object-cover" />} 
      <input type="file" onChange={(e) => setMissionImage(e.target.files[0])} className="mb-4 file-input file-input-bordered w-full" />
  
      <label className="block mb-2">Our Vision</label>
      <textarea
        name="ourVision"
        placeholder="Our Vision"
        value={formData.ourVision}
        onChange={handleChange}
        className="input input-bordered w-full mb-4"
      />
     {visionImage &&<img src={visionImage} alt={formData?.ourVision} className="w-24 h-24 rounded my-3 object-cover" />} 
      <input type="file" onChange={(e) => setVisionImage(e.target.files[0])} className="mb-4 file-input file-input-bordered w-full" />
  
      {/* Core Values */}
      <h3 className="text-xl font-semibold mt-6">Core Values</h3>
      {formData.coreValues.map((value, index) => (
        <div key={index} className="">
            <div className="mb-2 flex items-center gap-2 justify-between">
          <div className="w-[90%]">
          <label className="block mb-2">Core Value Title</label>
          <input
            placeholder="Core Value Title"
            value={value.title}
            onChange={(e) => handleNestedChange(e, index, "title", "coreValues")}
            className="input input-bordered w-full mb-2"
          />
          </div>
          <button
            type="button"
            onClick={() => deleteField(index, "coreValues")}
            className="w-[10%] text-2xl text-red-600 flex justify-end">
            <FaTrashAlt/>
          </button></div>
          <label className="block mb-2">Core Value Description</label>
          <textarea
            placeholder="Core Value Description"
            value={value.description}
            onChange={(e) => handleNestedChange(e, index, "description", "coreValues")}
            className="input input-bordered w-full h-24"
          />
          <hr className="my-3"/>
        </div>
      ))}
      <button type="button" onClick={() => addField("coreValues")} className="text-7xl text-black">+</button>
  
      {/* Why Choose Us */}
      <h3 className="text-xl font-semibold mt-6">Why Choose Us</h3>
      {formData.whyChooseUs.map((value, index) => (
        <div key={index} className="">
          <div className="flex gap-2 items-center">
          <div className="w-[90%]">
          <label className="block">Why Choose Us Title</label>
          <input
            placeholder="Why Choose Us Title"
            value={value.title}
            onChange={(e) => handleNestedChange(e, index, "title", "whyChooseUs")}
            className="input input-bordered w-full mb-2"
          />
          </div>
          <button
            type="button"
            onClick={() => deleteField(index, "whyChooseUs")}
            className="w-[10%] text-2xl text-red-600 flex justify-end">
            <FaTrashAlt/>
          </button></div>
          <label className="block mb-2">Why Choose Us Description</label>
          <textarea
            placeholder="Why Choose Us Description"
            value={value.description}
            onChange={(e) => handleNestedChange(e, index, "description", "whyChooseUs")}
            className="input input-bordered w-full h-24"
          />
          <hr className="my-3"/>
        </div>
      ))}
      <button type="button" onClick={() => addField("whyChooseUs")} className="text-7xl text-black">+</button>
  
      {/* Our Impact */}
      <h3 className="text-xl font-semibold mt-6">Our Impact</h3>
      {formData.ourImpact.map((value, index) => (
        <div key={index} className="">
          <div className="flex gap-2 items-center">
          <div className="w-[90%]">
          <label className="block mb-2">Impact Title</label>
          <input
            placeholder="Impact Title"
            value={value.title}
            onChange={(e) => handleNestedChange(e, index, "title", "ourImpact")}
            className="input input-bordered w-full mb-2"
          />
          </div>
          <button
            type="button"
            onClick={() => deleteField(index, "ourImpact")}
            className="w-[10%] text-2xl text-red-600 flex justify-end">
            <FaTrashAlt/>
          </button>
          </div>
          <label className="block mb-2">Impact Description</label>
          <textarea
            placeholder="Impact Description"
            value={value.description}
            onChange={(e) => handleNestedChange(e, index, "description", "ourImpact")}
            className="input input-bordered w-full h-24"
          />
          <hr className="my-3"/>
        </div>
      ))}
      <button type="button" onClick={() => addField("ourImpact")} className="text-7xl text-black">+</button>
  
      {/* Submit Button */}
      <button type="submit" className="btn btn-sm bg-black text-white mt-4 w-full">{formData.sectionTitle ? "Update About" : "Add About"}</button>
    </form>
  </div>
  
  );
};

export default About;