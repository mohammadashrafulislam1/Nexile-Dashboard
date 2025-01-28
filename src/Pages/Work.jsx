import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaTrashAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { endPoint } from '../Components/ForAll/ForAll';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';

const Work = () => {
  const [formData, setFormData] = useState({
    category: '', // category Ids
    title: '',
    projectUrl: '',
    githubUrl: '',
    client: '',
    shortDescription: '',
    problemGoal: '',
    servicesProvided: [], // Default service
    projectTimeline: '',
    customSolutions: '',
    metricsData: {
      trafficIncrease: '0',
      conversionRateImprovement: '0',
      pageSpeedImprovement: '0',
      seoImprovements: '0',
      videoEngagement: '0',
    },
    clientTestimonial: '',
    techStack: [],// TechStack Ids
    tags: [],
    isFeatured: false,
    completionDate: '',
    metaDescription: '',
    metaTitle: '',
    metaKeywords: [],
  });
  const { state } = useLocation();
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [service, setService] = useState('');
  const [tag, setTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [metaKeyword, setMetaKeyword] = useState('');
  const [workToUpdate, setWorkToUpdate] = useState();
  const [techCategory, setTechCategory] = useState();
  const [clientTestimonial, setClientTestimonial] = useState();
  const [techStacks, setTechStacks] = useState();
  const [selectedTechStacks, setSelectedTechStacks] = useState([]);
  const workToEdit = state?.work;
  
  console.log(formData)

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Extracts YYYY-MM-DD part
  };

  useEffect(() => {
    const fetchWorkData = async () => {
        try {
            const response = await axios.get(`${endPoint}/works/${workToEdit?._id}`);
            setWorkToUpdate(response?.data?.work);
            setFormData(response?.data?.work);
            setFormData((prevData) => ({
              ...prevData,
              completionDate: formatDate(workToEdit.completionDate), // Format the initial date
          }));
        setImages(response?.data?.work.images || []); // Set existing images if available
            console.log(response?.data?.work);
        } catch (error) {
            console.error('Error fetching property data:', error);
        }
    };
    fetchWorkData();

    const fetchSubMenus = async () => {
      try {
          const responseCategory = await axios.get(`${endPoint}/techCategory`);
          setTechCategory(responseCategory?.data?.techCategories);
          console.log(responseCategory?.data?.techCategories);

          const responseStacks = await axios.get(`${endPoint}/techStack`);
          setTechStacks(responseStacks?.data?.techStack);
          console.log(responseStacks?.data?.techStack);
          console.log(workToEdit?.techStack)
    console.log(responseStacks?.data?.techStack)
    if (workToEdit?.techStack) {
      const selectedTechStacks = responseStacks?.data?.techStack.filter(item => workToEdit.techStack.includes(item._id));
      setSelectedTechStacks(selectedTechStacks);
    }

          const responseTestimonials = await axios.get(`${endPoint}/clientTestimonial`);
          setClientTestimonial(responseTestimonials?.data?.testimonials);
          console.log(responseTestimonials?.data?.testimonials);
      } catch (error) {
          console.error('Error fetching property data:', error);
      }
  };
  fetchSubMenus()
}, [workToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages((prevImages) => {
        console.log('Previous images:', prevImages);
        console.log('Type of previous images:', typeof prevImages);
        const currentImages = Array.isArray(prevImages) ? prevImages : [];
        return [...currentImages, ...files];
    });
    const newImagePreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prevPreviews) => [...prevPreviews, ...newImagePreviews]);
   };

   const removeImage = async (index, img) => {
    console.log(index)
    // Check if workToEdit._id is available
    if (workToEdit?._id) {
      const publicId = img?.publicId; 
        try {
          // Make an API call to delete the image from the server
          await axios.delete(`${endPoint}/works/${workToEdit._id}/image`, {
            data: { publicId } // Send publicId in the request body
          });
  
          // If the deletion is successful, remove the image from local state
          setImages(images.filter((_, i) => i !== index)); // Remove the selected image
          toast.success(`Image deleted successfully`);
        } catch (error) {
          // Handle any errors that occur during the deletion
          console.error("Error deleting image:", error);
          toast.error("Error deleting image");
        }
      
    } else {
      // If workToEdit._id is not available, just remove the image locally
      setImages(images.filter((_, i) => i !== index)); // Remove the selected image
      toast.success(`Image removed from local data successfully`);
    }
  };
  
  const removePreviewImage = async (index, imgUrl) => {
    console.log(index);
    
    // Assuming previewImages is a separate state
    setPreviewImages(prev => prev.filter((_, i) => i !== index)); 
    toast.success(`Preview image removed successfully`);
  };


  const addService = () => {
    setFormData({ ...formData, servicesProvided: [...formData.servicesProvided, service] });
    setService('');
  };

  const addTag = () => {
    setFormData({ ...formData, tags: [...formData.tags, tag] });
    setTag('');
  };

  const addMetaKeyword = () => {
    setFormData({ ...formData, metaKeywords: [...formData.metaKeywords, metaKeyword] });
    setMetaKeyword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create a FormData object to send files and data
    const formDataToSend = new FormData();

    // Append other form data fields
    for (const key in formData) {
        if (Array.isArray(formData[key])) {
            formData[key].forEach((item) => {
                formDataToSend.append(key, item);
            });
        } else if (typeof formData[key] === 'object' && formData[key] !== null) {
            // If the value is an object, handle it separately
            for (const subKey in formData[key]) {
                formDataToSend.append(`${key}[${subKey}]`, formData[key][subKey]);
            }
        } else {
            formDataToSend.append(key, formData[key]);
        }
    }

    // Check if images is an array before using forEach
    console.log('Current images state:', images);
    console.log('Is images an array?', Array.isArray(images)); // Check if images is an array

    if (Array.isArray(images)) {
        images.forEach((image) => {
            formDataToSend.append('images', image);
        });
    } else {
        console.error('Images is not an array:', images);
    }

    // Log for debugging
    for (let [key, value] of formDataToSend.entries()) {
        console.log(key + ':', value);
    }

    try {
        console.log("workToEdit", workToEdit?._id);
        const response = workToEdit
            ? await axios.put(`${endPoint}/works/${workToEdit?._id}`, formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
              })
            : await axios.post(`${endPoint}/works`, formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
              });

        Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${workToEdit ? "Work updated successfully!" : "Work added successfully!"}`,
            showConfirmButton: false,
            timer: 1500,
        });
        console.log('Project added successfully:', response.data);
    } catch (error) {
        console.error('Error adding project:', error);
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: `${workToEdit ? "Error To Work Update!" : "Error To Work Add!"}`,
            showConfirmButton: false,
            timer: 1500,
        });
    } finally {
        setLoading(false);
    }
};


  const removeItem = (section, index) => {
    const updatedItems = [...formData[section]];
    updatedItems.splice(index, 1);
    setFormData({ ...formData, [section]: updatedItems });
  };

  const handleTechStackSelect = (stack) => {
    if (!selectedTechStacks.find((a) => a._id === stack._id)) {
      const updatedSelectedTechStacks = [...selectedTechStacks, stack];
      setSelectedTechStacks(updatedSelectedTechStacks);
      setFormData((prevState) => ({
        ...prevState,
        techStack: updatedSelectedTechStacks.map((a) => a._id), // Map to the IDs of the selected amenities
      }));
      toast.success("Amenity added successfuly!");
    } else {
      toast.error("Amenity already added!");
    }
  };

  const handleRemoveTechStack = (techStackId) => {
    const updatedSelectedTechStacks = selectedTechStacks.filter((techStack) => techStack._id !== techStackId);
    setSelectedTechStacks(updatedSelectedTechStacks);
    setFormData((prevState) => ({
      ...prevState,
      techStack: updatedSelectedTechStacks.map((a) => a._id),
    }));
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }
  console.log("selectedTechStacks", selectedTechStacks)
 

  return (
   <div className='mb-10'>
     <div className="breadcrumbs text-sm lg:w-1/2 md:w-[80%] w-[96%] mx-auto">
      <ul className="my-6">
        <li>
          <Link
            to="/" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
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
          <span className="inline-flex items-center gap-2 text-gray-700"><svg
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
            Services</span>
        </li>
      </ul>
    </div>
    <ToastContainer />
    <Link to="/manageworks">
      <button className="btn btn-sm flex justify-center items-center mx-auto bg-black text-white">Manage Works</button></Link>
     {workToUpdate ? <h3 className="lg:w-1/2 md:w-[80%] w-[96%] mx-auto text-center my-8 font-bold text-xl">Update Work</h3>: <h3 className="lg:w-1/2 md:w-[80%] w-[96%] mx-auto text-center my-8 font-bold text-xl">Add Work</h3> } 
     
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md lg:w-1/2 md:w-[80%] w-[96%] mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Add New Work</h2>

      <div>
        <input 
          type="text" 
          name="title" 
          placeholder="Project Title" 
          onChange={handleChange} 
          value={formData.title} 
          className="input input-bordered w-full mb-2" 
          required 
        />
        <select 
  className="select select-bordered w-full my-3" 
  value={formData.category} 
  name="category"
  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
>
  <option disabled value="">Select Category</option>
  {
    techCategory && techCategory.map((category) => (
      <option key={category._id} value={category._id}>{category.name}</option>
    ))
  }
</select>

      </div>

      <div>
        <input 
          type="text" 
          name="projectUrl" 
          placeholder="Project URL" 
          onChange={handleChange} 
          value={formData.projectUrl} 
          className="input input-bordered w-full mb-2" 
        />
        <input 
          type="text" 
          name="githubUrl" 
          placeholder="GitHub URL" 
          onChange={handleChange} 
          value={formData.githubUrl} 
          className="input input-bordered w-full mb-2" 
        />
      </div>

      <textarea 
        name="shortDescription" 
        placeholder="Short Description" 
        onChange={handleChange} 
        value={formData.shortDescription} 
        className="textarea textarea-bordered w-full mb-4" 
        rows="3" 
      />

      {/* Services Provided Section */}
      <div className="mb-4">
        <h3 className="text-lg font-bold capitalize mb-2">Services Provided</h3>
        {formData.servicesProvided.map((service, index) => (
          <div key={index} className="mb-2 border p-4 rounded-md">
            <div className="mb-2 flex items-center gap-2 justify-between">
              <div className="w-[90%]">
                <label className="block text-gray-700 mb-1">Service</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={service}
                  onChange={(e) => {
                    const updatedServices = [...formData.servicesProvided];
                    updatedServices[index] = e.target.value;
                    setFormData({ ...formData, servicesProvided: updatedServices });
                  }}
                  required
                />
              </div>
              <button type="button" className="w-[10%] text-2xl text-red-600 flex justify-end" onClick={() => removeItem('servicesProvided', index)}>
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ))}
        <button type="button" className="text-7xl text-black" onClick={addService}>
          +
        </button>
      </div>

      {/* Tech Stack Section */}
      <div className="form-control">
          <label className="label">
            <span className="label-text">Tech Stacks</span>
          </label>
          <div className="grid lg:grid-cols-3 gap-5 sm:grid-cols-1 md:grid-cols-3">
            {techStacks?.map((stack) => (
              <div
                key={stack._id}
                className="flex items-center border p-2 rounded w-max gap-2"
              >
                <img
                  src={stack?.image}
                  alt={stack.title}
                  className="w-10 h-10 object-cover"
                />
                <span>{stack.title}</span>
                <button
                  type="button"
                  onClick={() => handleTechStackSelect(stack)}
                  className="btn btn-sm btn-outline"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-2xl mt-10">Selected Tech Stacks:</h3>
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedTechStacks?.length === 0 ? (
                <p>No techstack selected.</p>
              ) : (
                selectedTechStacks?.map((stack) => (
                  <div
                    key={stack?._id}
                    className="flex items-center space-x-2 border p-2 rounded"
                  >
                    <img
                      src={stack?.image}
                      alt={stack?.title}
                      className="w-10 h-10 object-cover"
                    />
                    <span>{stack?.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTechStack(stack?._id)}
                      className="ml-auto text-[#fc0000]"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      {/* Tags Section */}
      <div className="mb-4">
        <h3 className="text-lg font-bold capitalize mb-2">Tags</h3>
        {formData.tags.map((tag, index) => (
          <div key={index} className="mb-2 border p-4 rounded-md">
            <div className="flex justify-between">
              <span>{tag}</span>
              <button type="button" className="text-red-600" onClick={() => removeItem('tags', index)}>
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ))}
        <input 
          type="text" 
          placeholder="Add Tag" 
          value={tag} 
          onChange={(e) => setTag(e.target.value)} 
          className="input input-bordered w-full mb-2" 
        />
        <button type="button" className="btn btn-primary" onClick={addTag}>
          Add Tag
        </button>
      </div>

      {/* Meta Keywords Section */}
      <div className="mb-4">
        <h3 className="text-lg font-bold capitalize mb-2">Meta Keywords</h3>
        {formData.metaKeywords.map((keyword, index) => (
          <div key={index} className="mb-2 border p-4 rounded-md">
            <div className="flex justify-between">
              <span>{keyword}</span>
              <button type="button" className="text-red-600" onClick={() => removeItem('metaKeywords', index)}>
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ))}
        <input 
          type="text" 
          placeholder="Add Meta Keyword" 
          value={metaKeyword} 
          onChange={(e) => setMetaKeyword(e.target.value)} 
          className="input input-bordered w-full mb-2" 
        />
        <button type="button" className="btn btn-primary" onClick={addMetaKeyword}>
          Add Meta Keyword
        </button>
      </div>

      {/* Other Fields */}
      <div>
        <input 
          type="text" 
          name="client" 
          placeholder="Client Name" 
          onChange={handleChange} 
          value={formData.client} 
          className="input input-bordered w-full mb-2" 
        />
        <textarea 
          name="problemGoal" 
          placeholder="Problem/Goal" 
          onChange={handleChange} 
          value={formData.problemGoal} 
          className="textarea textarea-bordered w-full mb-2" 
          rows="3" 
        />
        <textarea 
          name="customSolutions" 
          placeholder="Custom Solutions" 
          onChange={handleChange} 
          value={formData.customSolutions} 
          className="textarea textarea-bordered w-full mb-2" 
          rows="3" 
        />
        <input 
          type="text" 
          name="projectTimeline" 
          placeholder="Project Timeline" 
          onChange={handleChange} 
          value={formData.projectTimeline} 
          className="input input-bordered w-full mb-2" 
        />
      </div>

      {/* Metrics Data Section */}
      <div className="mb-4">
  <h3 className="text-lg font-bold capitalize mb-2">Metrics Data</h3>
  {/* Check if metricsData exists and is an object; if not, initialize with all default keys */}
  {formData.metricsData && typeof formData.metricsData === 'object'
    && Object.keys(formData.metricsData).map((key) => (
        <div key={key}>
          <input
            type="text"
            placeholder={key.replace(/([A-Z])/g, ' $1').toLowerCase()}
            name={key}
            value={formData.metricsData[key] || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                metricsData: { ...formData.metricsData, [key]: e.target.value },
              })
            }
            className="input input-bordered w-full mb-2"
          />
        </div>
      )
  )}
</div>



<select 
  className="select select-bordered w-full my-3" 
  value={formData.clientTestimonial} 
  name="category"
  onChange={(e) => setFormData({ ...formData, clientTestimonial: e.target.value })}
>
  <option disabled value="">Select Client Testimonial</option>
  {
    clientTestimonial && clientTestimonial.map((testimonial) => (
      <option key={testimonial._id} value={testimonial._id} className='bg-gray-200 p-4 rounded-xl my-2 mx-2'>{testimonial.
        testimonialText
      }</option>
      
    ))
  }
</select>

      <label className="flex items-center mb-2">
        <input 
          type="checkbox" 
          name="isFeatured" 
          checked={formData.isFeatured} 
          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} 
          className="mr-2" 
        />
        Featured Project
      </label>
{ console.log("formData.completionDate", formData.completionDate)}
      <input 
        type="date" 
        name="completionDate" 
        onChange={handleChange} 
        value={formData.completionDate} 
        className="input input-bordered w-full mb-2" 
      />
      <input 
        name="metaTitle" 
        placeholder="Meta Title" 
        onChange={handleChange} 
        value={formData.metaTitle} 
        className="input input-bordered w-full mb-2" 
      />

      <textarea 
        name="metaDescription" 
        placeholder="Meta Description" 
        onChange={handleChange} 
        value={formData.metaDescription} 
        className="textarea textarea-bordered w-full mb-2" 
        rows="3" 
      />

      {/* Image Upload */}
      <div className="mb-4">
      <h3 className="text-lg font-bold capitalize mb-2">Upload Images</h3>
      <input
        type="file"
        onChange={handleImageUpload}
        className="file-input file-input-bordered w-full mb-2"
        accept="image/*"
        multiple // Allow multiple uploads
      />

<div className="flex flex-wrap gap-3 mt-3">
  {previewImages && previewImages.length > 0 ? (
    previewImages.map((img, index) => (
      <div key={`preview-${index}`} className="flex justify-between items-center mb-2 relative w-28 h-28 rounded-md">
        <img
          src={img}
          alt={`Uploaded preview ${index}`}
          className="w-28 h-28 object-cover mr-2 rounded-md"
        />
        <button
          type="button"
          className="text-red-600 bg-[#fff] p-1 rounded-full text-[12px] absolute top-1 right-1"
          onClick={() => removePreviewImage(index, img)}
        >
          <FaTrashAlt />
        </button>
      </div>
    ))
  ) : null}
  
  {images && images.length > 0 ? (
      images
        .filter(img => img.url)?.map((img, index) => (
      <div key={`image-${index}`} className="flex justify-between items-center mb-2 relative w-28 h-28 rounded-md">
        <img
          src={img?.url}
          alt={`Uploaded image ${index}`}
          className="w-28 h-28 object-cover mr-2 rounded-md"
        />
        <button
          type="button"
          className="text-red-600 bg-[#fff] p-1 rounded-full text-[12px] absolute top-1 right-1"
          onClick={() => removeImage(index, img)}
        >
          <FaTrashAlt />
        </button> 
      </div>
    ))
  ) : null}
</div>


    </div>

      <button type="submit" className="btn btn-sm bg-black text-white mt-4 w-full">{workToEdit ? "Update Work" : "Add Work"}</button>
    </form>
  </div>
);
};

export default Work;
