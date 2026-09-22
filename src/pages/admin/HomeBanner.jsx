// import React, {
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import {
//   Image as ImageIcon,
//   Upload,
//   Save,
//   RefreshCw,
//   CheckCircle2,
//   AlertCircle,
//   Eye,
//   EyeOff,
//   X,
//   Type,
//   Link as LinkIcon,
//   CakeSlice,
//   Sparkles,
// } from "lucide-react";

// const API_ROOT =
//   "https://coreops.pk/cakes/api";

// const emptyForm = {
//   id: 0,

//   image: "",
//   image_url: "",

//   secondary_image: "",
//   secondary_image_url: "",

//   brand_small_text:
//     "JUST BAKE IT OFFICIAL",

//   brand_title:
//     "Fresh & Delicious Cakes",

//   eyebrow_text:
//     "HANDCRAFTED IN LAHORE",

//   heading:
//     "Cakes made for",

//   heading_highlight:
//     "beautiful moments.",

//   subheading:
//     "Elegant, handcrafted cakes made fresh with thoughtful details, premium ingredients and a little bit of magic.",

//   button_text:
//     "Explore Cakes",

//   button_link:
//     "/cakes",

//   secondary_button_text:
//     "Browse Collections",

//   secondary_button_link:
//     "/cakes",

//   vertical_text:
//     "made with love",

//   product_label:
//     "OUR FAVOURITE",

//   product_title:
//     "Lotus three milk cake",

//   product_price:
//     "Rs. 2,200",

//   feature_one:
//     "Freshly Baked",

//   feature_two:
//     "Made With Love",

//   feature_three:
//     "Custom Designs",


//   hero_brand_small_color: "#8B5E3C",
//   hero_brand_title_color: "#2C211C",
//   hero_eyebrow_color: "#AD7359",
//   hero_heading_color: "#2C211C",
//   hero_highlight_color: "#B9795D",
//   hero_subheading_color: "#755F54",
//   hero_heading_font: "Georgia, 'Times New Roman', serif",
//   hero_body_font: "Arial, Helvetica, sans-serif",
//   hero_primary_text_color: "#FFFFFF",
//   hero_primary_bg_color: "#2B211D",
//   hero_secondary_text_color: "#2B211D",
//   hero_secondary_bg_color: "#F6EDE5",

//   custom_eyebrow_color: "#AD7359",
//   custom_heading_color: "#2C211C",
//   custom_highlight_color: "#B9795D",
//   custom_description_color: "#755F54",
//   custom_heading_font: "Georgia, 'Times New Roman', serif",
//   custom_body_font: "Arial, Helvetica, sans-serif",
//   custom_button_text_color: "#FFFFFF",
//   custom_button_bg_color: "#2B211D",

//   custom_image: "",
//   custom_image_url: "",
//   custom_eyebrow: "MADE JUST FOR YOU",
//   custom_heading: "Have something",
//   custom_heading_highlight: "special",
//   custom_heading_after: "in mind?",
//   custom_description:
//     "Tell us about your celebration and we'll help create a cake that feels uniquely yours — from colours and flavours to every beautiful finishing detail.",
//   custom_button_text: "Create Your Cake",
//   custom_button_link: "/cakes",
//   custom_is_active: 1,

//   is_active: 1,
// };

// const HomeBanner = () => {
//   const mainImageInputRef =
//     useRef(null);

//   const secondaryImageInputRef =
//     useRef(null);

//   const customImageInputRef =
//     useRef(null);

//   const [form, setForm] =
//     useState(emptyForm);

//   const [mainFile, setMainFile] =
//     useState(null);

//   const [
//     secondaryFile,
//     setSecondaryFile,
//   ] = useState(null);

//   const [customFile, setCustomFile] =
//     useState(null);

//   const [
//     mainPreview,
//     setMainPreview,
//   ] = useState("");

//   const [
//     secondaryPreview,
//     setSecondaryPreview,
//   ] = useState("");

//   const [customPreview, setCustomPreview] =
//     useState("");

//   const [loading, setLoading] =
//     useState(true);

//   const [saving, setSaving] =
//     useState(false);

//   const [
//     successMessage,
//     setSuccessMessage,
//   ] = useState("");

//   const [
//     errorMessage,
//     setErrorMessage,
//   ] = useState("");

//   /*
//   |--------------------------------------------------------------------------
//   | LOAD HERO
//   |--------------------------------------------------------------------------
//   */

//   const loadBanner = async () => {
//     try {
//       setLoading(true);
//       setErrorMessage("");

//       const response = await fetch(
//         `${API_ROOT}/HomeBanner/get.php`
//       );

//       const result =
//         await response.json();

//       if (
//         !response.ok ||
//         result.status !== "success"
//       ) {
//         throw new Error(
//           result.message ||
//             "Unable to load home hero."
//         );
//       }

//       if (result.data) {
//         setForm({
//           ...emptyForm,
//           ...result.data,

//           id: Number(
//             result.data.id || 0
//           ),

//           is_active:
//             Number(
//               result.data.is_active
//             ) === 1
//               ? 1
//               : 0,

//           image:
//             result.data.image || "",

//           image_url:
//             result.data.image_url || "",

//           secondary_image:
//             result.data
//               .secondary_image || "",

//           secondary_image_url:
//             result.data
//               .secondary_image_url || "",

//           custom_image:
//             result.data.custom_image || "",

//           custom_image_url:
//             result.data.custom_image_url || "",

//           custom_is_active:
//             Number(result.data.custom_is_active) === 1
//               ? 1
//               : 0,
//         });
//       }
//     } catch (error) {
//       console.error(error);

//       setErrorMessage(
//         error.message ||
//           "Unable to load home hero."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadBanner();
//   }, []);

//   /*
//   |--------------------------------------------------------------------------
//   | CLEAN PREVIEWS
//   |--------------------------------------------------------------------------
//   */

//   useEffect(() => {
//     return () => {
//       if (mainPreview) {
//         URL.revokeObjectURL(
//           mainPreview
//         );
//       }
//     };
//   }, [mainPreview]);

//   useEffect(() => {
//     return () => {
//       if (secondaryPreview) {
//         URL.revokeObjectURL(
//           secondaryPreview
//         );
//       }
//     };
//   }, [secondaryPreview]);

//   useEffect(() => {
//     return () => {
//       if (customPreview) {
//         URL.revokeObjectURL(customPreview);
//       }
//     };
//   }, [customPreview]);

//   /*
//   |--------------------------------------------------------------------------
//   | TEXT INPUT
//   |--------------------------------------------------------------------------
//   */

//   const handleChange = (event) => {
//     const {
//       name,
//       value,
//     } = event.target;

//     setForm((previous) => ({
//       ...previous,
//       [name]: value,
//     }));

//     setSuccessMessage("");
//     setErrorMessage("");
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | IMAGE VALIDATION
//   |--------------------------------------------------------------------------
//   */

//   const validateImage = (file) => {
//     const allowedTypes = [
//       "image/jpeg",
//       "image/png",
//       "image/webp",
//     ];

//     if (
//       !allowedTypes.includes(
//         file.type
//       )
//     ) {
//       setErrorMessage(
//         "Only JPG, PNG and WEBP images are allowed."
//       );

//       return false;
//     }

//     if (
//       file.size >
//       8 * 1024 * 1024
//     ) {
//       setErrorMessage(
//         "Image must be smaller than 8 MB."
//       );

//       return false;
//     }

//     return true;
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | MAIN IMAGE
//   |--------------------------------------------------------------------------
//   */

//   const handleMainImage = (
//     event
//   ) => {
//     const file =
//       event.target.files?.[0];

//     if (!file) return;

//     if (!validateImage(file)) {
//       event.target.value = "";
//       return;
//     }

//     if (mainPreview) {
//       URL.revokeObjectURL(
//         mainPreview
//       );
//     }

//     setMainFile(file);

//     setMainPreview(
//       URL.createObjectURL(file)
//     );

//     setSuccessMessage("");
//     setErrorMessage("");
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | SECONDARY IMAGE
//   |--------------------------------------------------------------------------
//   */

//   const handleSecondaryImage = (
//     event
//   ) => {
//     const file =
//       event.target.files?.[0];

//     if (!file) return;

//     if (!validateImage(file)) {
//       event.target.value = "";
//       return;
//     }

//     if (secondaryPreview) {
//       URL.revokeObjectURL(
//         secondaryPreview
//       );
//     }

//     setSecondaryFile(file);

//     setSecondaryPreview(
//       URL.createObjectURL(file)
//     );

//     setSuccessMessage("");
//     setErrorMessage("");
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | CUSTOM SECTION IMAGE
//   |--------------------------------------------------------------------------
//   */

//   const handleCustomImage = (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     if (!validateImage(file)) {
//       event.target.value = "";
//       return;
//     }

//     if (customPreview) {
//       URL.revokeObjectURL(customPreview);
//     }

//     setCustomFile(file);
//     setCustomPreview(URL.createObjectURL(file));
//     setSuccessMessage("");
//     setErrorMessage("");
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | UPLOAD IMAGE
//   |--------------------------------------------------------------------------
//   */

//   const uploadImage = async (
//     file
//   ) => {
//     if (!file) {
//       return null;
//     }

//     const data =
//       new FormData();

//     data.append(
//       "image",
//       file
//     );

//     const response =
//       await fetch(
//         `${API_ROOT}/HomeBanner/upload.php`,
//         {
//           method: "POST",
//           body: data,
//         }
//       );

//     const result =
//       await response.json();

//     if (
//       !response.ok ||
//       result.status !== "success"
//     ) {
//       throw new Error(
//         result.message ||
//           "Unable to upload image."
//       );
//     }

//     return result;
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | REMOVE NEW MAIN SELECTION
//   |--------------------------------------------------------------------------
//   */

//   const removeMainSelection = () => {
//     if (mainPreview) {
//       URL.revokeObjectURL(
//         mainPreview
//       );
//     }

//     setMainFile(null);
//     setMainPreview("");

//     if (
//       mainImageInputRef.current
//     ) {
//       mainImageInputRef.current.value =
//         "";
//     }
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | REMOVE SECONDARY SELECTION
//   |--------------------------------------------------------------------------
//   */

//   const removeSecondarySelection =
//     () => {
//       if (secondaryPreview) {
//         URL.revokeObjectURL(
//           secondaryPreview
//         );
//       }

//       setSecondaryFile(null);

//       setSecondaryPreview("");

//       if (
//         secondaryImageInputRef.current
//       ) {
//         secondaryImageInputRef.current.value =
//           "";
//       }

//       if (customImageInputRef.current) {
//         customImageInputRef.current.value = "";
//       }
//     };

//   const removeCustomSelection = () => {
//     if (customPreview) {
//       URL.revokeObjectURL(customPreview);
//     }

//     setCustomFile(null);
//     setCustomPreview("");

//     if (customImageInputRef.current) {
//       customImageInputRef.current.value = "";
//     }
//   };

//   const toggleCustomStatus = () => {
//     setForm((previous) => ({
//       ...previous,
//       custom_is_active:
//         previous.custom_is_active === 1 ? 0 : 1,
//     }));
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | STATUS
//   |--------------------------------------------------------------------------
//   */

//   const toggleStatus = () => {
//     setForm((previous) => ({
//       ...previous,

//       is_active:
//         previous.is_active === 1
//           ? 0
//           : 1,
//     }));
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | SAVE
//   |--------------------------------------------------------------------------
//   */

//   const handleSave = async (
//     event
//   ) => {
//     event.preventDefault();

//     if (saving) return;

//     try {
//       setSaving(true);

//       setSuccessMessage("");
//       setErrorMessage("");

//       let mainImage =
//         form.image;

//       let mainImageUrl =
//         form.image_url;

//       let secondImage =
//         form.secondary_image;

//       let secondImageUrl =
//         form.secondary_image_url;

//       let customImage =
//         form.custom_image;

//       let customImageUrl =
//         form.custom_image_url;

//       /*
//       | MAIN IMAGE
//       */

//       if (mainFile) {
//         const uploaded =
//           await uploadImage(
//             mainFile
//           );

//         mainImage =
//           uploaded.file_name;

//         mainImageUrl =
//           uploaded.image_url;
//       }

//       /*
//       | SECONDARY IMAGE
//       */

//       if (secondaryFile) {
//         const uploaded =
//           await uploadImage(
//             secondaryFile
//           );

//         secondImage =
//           uploaded.file_name;

//         secondImageUrl =
//           uploaded.image_url;
//       }

//       /*
//       | CUSTOM SECTION IMAGE
//       */

//       if (customFile) {
//         const uploaded =
//           await uploadImage(customFile);

//         customImage =
//           uploaded.file_name;

//         customImageUrl =
//           uploaded.image_url;
//       }

//       /*
//       | SAVE TEXT + IMAGE NAMES
//       */

//       const payload = {
//         id: Number(
//           form.id || 0
//         ),

//         image:
//           mainImage || "",

//         secondary_image:
//           secondImage || "",

//         brand_small_text:
//           form.brand_small_text.trim(),

//         brand_title:
//           form.brand_title.trim(),

//         eyebrow_text:
//           form.eyebrow_text.trim(),

//         heading:
//           form.heading.trim(),

//         heading_highlight:
//           form.heading_highlight.trim(),

//         subheading:
//           form.subheading.trim(),

//         button_text:
//           form.button_text.trim(),

//         button_link:
//           form.button_link.trim(),

//         secondary_button_text:
//           form.secondary_button_text.trim(),

//         secondary_button_link:
//           form.secondary_button_link.trim(),

//         vertical_text:
//           form.vertical_text.trim(),

//         product_label:
//           form.product_label.trim(),

//         product_title:
//           form.product_title.trim(),

//         product_price:
//           form.product_price.trim(),

//         feature_one:
//           form.feature_one.trim(),

//         feature_two:
//           form.feature_two.trim(),

//         feature_three:
//           form.feature_three.trim(),


//         hero_brand_small_color: form.hero_brand_small_color,
//         hero_brand_title_color: form.hero_brand_title_color,
//         hero_eyebrow_color: form.hero_eyebrow_color,
//         hero_heading_color: form.hero_heading_color,
//         hero_highlight_color: form.hero_highlight_color,
//         hero_subheading_color: form.hero_subheading_color,
//         hero_heading_font: form.hero_heading_font,
//         hero_body_font: form.hero_body_font,
//         hero_primary_text_color: form.hero_primary_text_color,
//         hero_primary_bg_color: form.hero_primary_bg_color,
//         hero_secondary_text_color: form.hero_secondary_text_color,
//         hero_secondary_bg_color: form.hero_secondary_bg_color,

//         custom_eyebrow_color: form.custom_eyebrow_color,
//         custom_heading_color: form.custom_heading_color,
//         custom_highlight_color: form.custom_highlight_color,
//         custom_description_color: form.custom_description_color,
//         custom_heading_font: form.custom_heading_font,
//         custom_body_font: form.custom_body_font,
//         custom_button_text_color: form.custom_button_text_color,
//         custom_button_bg_color: form.custom_button_bg_color,

//         custom_image:
//           customImage || "",

//         custom_eyebrow:
//           form.custom_eyebrow.trim(),

//         custom_heading:
//           form.custom_heading.trim(),

//         custom_heading_highlight:
//           form.custom_heading_highlight.trim(),

//         custom_heading_after:
//           form.custom_heading_after.trim(),

//         custom_description:
//           form.custom_description.trim(),

//         custom_button_text:
//           form.custom_button_text.trim(),

//         custom_button_link:
//           form.custom_button_link.trim(),

//         custom_is_active:
//           Number(form.custom_is_active),

//         is_active:
//           Number(
//             form.is_active
//           ),
//       };

//       const response =
//         await fetch(
//           `${API_ROOT}/HomeBanner/save.php`,
//           {
//             method: "POST",

//             headers: {
//               "Content-Type":
//                 "application/json",
//             },

//             body: JSON.stringify(
//               payload
//             ),
//           }
//         );

//       const result =
//         await response.json();

//       if (
//         !response.ok ||
//         result.status !== "success"
//       ) {
//         throw new Error(
//           result.message ||
//             "Unable to save home hero."
//         );
//       }

//       setForm(
//         (previous) => ({
//           ...previous,

//           id: Number(
//             result.id ||
//               previous.id
//           ),

//           image:
//             mainImage,

//           image_url:
//             mainImageUrl,

//           secondary_image:
//             secondImage,

//           secondary_image_url:
//             secondImageUrl,

//           custom_image:
//             customImage,

//           custom_image_url:
//             customImageUrl,
//         })
//       );

//       setMainFile(null);
//       setSecondaryFile(null);
//       setCustomFile(null);

//       setMainPreview("");
//       setSecondaryPreview("");
//       setCustomPreview("");

//       if (
//         mainImageInputRef.current
//       ) {
//         mainImageInputRef.current.value =
//           "";
//       }

//       if (
//         secondaryImageInputRef.current
//       ) {
//         secondaryImageInputRef.current.value =
//           "";
//       }

//       if (customImageInputRef.current) {
//         customImageInputRef.current.value = "";
//       }

//       setSuccessMessage(
//         "Home hero updated successfully."
//       );

//       await loadBanner();

//       setSuccessMessage(
//         "Home hero updated successfully."
//       );
//     } catch (error) {
//       console.error(error);

//       setErrorMessage(
//         error.message ||
//           "Unable to save home hero."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | REFRESH
//   |--------------------------------------------------------------------------
//   */

//   const handleRefresh =
//     async () => {
//       removeMainSelection();
//       removeSecondarySelection();
//       removeCustomSelection();

//       setSuccessMessage("");
//       setErrorMessage("");

//       await loadBanner();
//     };

//   const mainImageSrc =
//     mainPreview ||
//     form.image_url ||
//     "";

//   const secondaryImageSrc =
//     secondaryPreview ||
//     form.secondary_image_url ||
//     "";

//   const customImageSrc =
//     customPreview ||
//     form.custom_image_url ||
//     "";

//   if (loading) {
//     return (
//       <div className="hero-admin-loading">
//         <RefreshCw
//           size={30}
//           className="hero-admin-spin"
//         />

//         <span>
//           Loading Home Hero...
//         </span>
//       </div>
//     );
//   }

//   return (
//     <div className="hero-admin-page">

//       {/* HEADER */}

//       <div className="hero-admin-header">

//         <div>
//           <div className="hero-admin-heading-row">

//             <div className="hero-admin-heading-icon">
//               <ImageIcon
//                 size={22}
//               />
//             </div>

//             <div>
//               <h1>
//                 Home Hero
//               </h1>

//               <p>
//                 Manage the complete
//                 hero section displayed
//                 on your website.
//               </p>
//             </div>

//           </div>
//         </div>

//         <button
//           type="button"
//           className="hero-admin-refresh"
//           onClick={
//             handleRefresh
//           }
//           disabled={saving}
//         >
//           <RefreshCw
//             size={17}
//           />

//           Refresh
//         </button>

//       </div>

//       {/* MESSAGES */}

//       {successMessage && (
//         <div className="hero-admin-alert success">
//           <CheckCircle2
//             size={18}
//           />

//           {successMessage}
//         </div>
//       )}

//       {errorMessage && (
//         <div className="hero-admin-alert error">
//           <AlertCircle
//             size={18}
//           />

//           {errorMessage}
//         </div>
//       )}

//       <form
//         onSubmit={
//           handleSave
//         }
//       >

//         {/* =========================
//             IMAGES
//         ========================== */}

//         <div className="hero-admin-section">

//           <div className="hero-admin-section-title">
//             <ImageIcon
//               size={19}
//             />

//             <div>
//               <h2>
//                 Hero Images
//               </h2>

//               <p>
//                 Manage the two images
//                 displayed on the right
//                 side of the home hero.
//               </p>
//             </div>
//           </div>

//           <div className="hero-admin-image-grid">

//             {/* MAIN */}

//             <div className="hero-admin-image-box">

//               <div className="hero-admin-field-title">
//                 Main Cake Image
//               </div>

//               <div className="hero-admin-main-preview">

//                 {mainImageSrc ? (
//                   <img
//                     src={
//                       mainImageSrc
//                     }
//                     alt="Main Hero"
//                   />
//                 ) : (
//                   <ImageIcon
//                     size={45}
//                   />
//                 )}

//                 {mainFile && (
//                   <button
//                     type="button"
//                     className="hero-admin-remove"
//                     onClick={
//                       removeMainSelection
//                     }
//                   >
//                     <X size={16} />
//                   </button>
//                 )}

//               </div>

//               <input
//                 ref={
//                   mainImageInputRef
//                 }
//                 type="file"
//                 accept="image/jpeg,image/png,image/webp"
//                 hidden
//                 onChange={
//                   handleMainImage
//                 }
//               />

//               <button
//                 type="button"
//                 className="hero-admin-upload"
//                 onClick={() =>
//                   mainImageInputRef.current?.click()
//                 }
//               >
//                 <Upload
//                   size={17}
//                 />

//                 {mainImageSrc
//                   ? "Change Main Image"
//                   : "Upload Main Image"}
//               </button>

//               <small>
//                 Recommended portrait /
//                 square cake image.
//               </small>

//             </div>

//             {/* SECONDARY */}

//             <div className="hero-admin-image-box">

//               <div className="hero-admin-field-title">
//                 Secondary Image
//               </div>

//               <div className="hero-admin-secondary-preview">

//                 {secondaryImageSrc ? (
//                   <img
//                     src={
//                       secondaryImageSrc
//                     }
//                     alt="Secondary Hero"
//                   />
//                 ) : (
//                   <ImageIcon
//                     size={40}
//                   />
//                 )}

//                 {secondaryFile && (
//                   <button
//                     type="button"
//                     className="hero-admin-remove"
//                     onClick={
//                       removeSecondarySelection
//                     }
//                   >
//                     <X size={16} />
//                   </button>
//                 )}

//               </div>

//               <input
//                 ref={
//                   secondaryImageInputRef
//                 }
//                 type="file"
//                 accept="image/jpeg,image/png,image/webp"
//                 hidden
//                 onChange={
//                   handleSecondaryImage
//                 }
//               />

//               <button
//                 type="button"
//                 className="hero-admin-upload"
//                 onClick={() =>
//                   secondaryImageInputRef.current?.click()
//                 }
//               >
//                 <Upload
//                   size={17}
//                 />

//                 {secondaryImageSrc
//                   ? "Change Secondary Image"
//                   : "Upload Secondary Image"}
//               </button>

//               <small>
//                 This is the smaller
//                 overlapping image.
//               </small>

//             </div>

//           </div>
//         </div>

//         {/* =========================
//             MAIN CONTENT
//         ========================== */}

//         <div className="hero-admin-section">

//           <div className="hero-admin-section-title">
//             <Type size={19} />

//             <div>
//               <h2>
//                 Main Hero Content
//               </h2>

//               <p>
//                 Edit the main text shown
//                 on the left side.
//               </p>
//             </div>
//           </div>

//           <div className="hero-admin-form-grid">

//             <Field
//               label="Small Brand Text"
//               name="brand_small_text"
//               value={
//                 form.brand_small_text
//               }
//               onChange={
//                 handleChange
//               }
//               placeholder="JUST BAKE IT OFFICIAL"
//             />

//             <Field
//               label="Brand Title"
//               name="brand_title"
//               value={
//                 form.brand_title
//               }
//               onChange={
//                 handleChange
//               }
//               placeholder="Fresh & Delicious Cakes"
//             />

//             <Field
//               label="Eyebrow Text"
//               name="eyebrow_text"
//               value={
//                 form.eyebrow_text
//               }
//               onChange={
//                 handleChange
//               }
//               placeholder="HANDCRAFTED IN LAHORE"
//             />

//             <Field
//               label="Main Heading"
//               name="heading"
//               value={
//                 form.heading
//               }
//               onChange={
//                 handleChange
//               }
//               placeholder="Cakes made for"
//             />

//             <Field
//               label="Highlighted Heading"
//               name="heading_highlight"
//               value={
//                 form.heading_highlight
//               }
//               onChange={
//                 handleChange
//               }
//               placeholder="beautiful moments."
//             />

//             <Field
//               label="Vertical Text"
//               name="vertical_text"
//               value={
//                 form.vertical_text
//               }
//               onChange={
//                 handleChange
//               }
//               placeholder="made with love"
//             />

//             <div className="hero-admin-field full">
//               <label>
//                 Description
//               </label>

//               <textarea
//                 name="subheading"
//                 value={
//                   form.subheading
//                 }
//                 onChange={
//                   handleChange
//                 }
//                 rows={4}
//                 placeholder="Hero description..."
//               />
//             </div>

//           </div>
//         </div>

//         {/* =========================
//             BUTTONS
//         ========================== */}

//         <div className="hero-admin-section">

//           <div className="hero-admin-section-title">
//             <LinkIcon
//               size={19}
//             />

//             <div>
//               <h2>
//                 Hero Buttons
//               </h2>

//               <p>
//                 Control button text
//                 and destinations.
//               </p>
//             </div>
//           </div>

//           <div className="hero-admin-form-grid">

//             <Field
//               label="Primary Button Text"
//               name="button_text"
//               value={
//                 form.button_text
//               }
//               onChange={
//                 handleChange
//               }
//               placeholder="Explore Cakes"
//             />

//             <Field
//               label="Primary Button Link"
//               name="button_link"
//               value={
//                 form.button_link
//               }
//               onChange={
//                 handleChange
//               }
//               placeholder="/cakes"
//             />

//             <Field
//               label="Secondary Button Text"
//               name="secondary_button_text"
//               value={
//                 form.secondary_button_text
//               }
//               onChange={
//                 handleChange
//               }
//               placeholder="Browse Collections"
//             />

//             <Field
//               label="Secondary Button Link"
//               name="secondary_button_link"
//               value={
//                 form.secondary_button_link
//               }
//               onChange={
//                 handleChange
//               }
//               placeholder="/cakes"
//             />

//           </div>
//         </div>

//         {/* =========================
//             PRODUCT CARD
//         ========================== */}

//         <div className="hero-admin-section">

//           <div className="hero-admin-section-title">
//             <CakeSlice
//               size={19}
//             />

//             <div>
//               <h2>
//                 Featured Cake Card
//               </h2>

//               <p>
//                 Edit the small card
//                 displayed over the main
//                 cake image.
//               </p>
//             </div>
//           </div>

//           <div className="hero-admin-form-grid">

//             <Field
//               label="Card Label"
//               name="product_label"
//               value={
//                 form.product_label
//               }
//               onChange={
//                 handleChange
//               }
//               placeholder="OUR FAVOURITE"
//             />

//             <Field
//               label="Cake Name"
//               name="product_title"
//               value={
//                 form.product_title
//               }
//               onChange={
//                 handleChange
//               }
//               placeholder="Lotus three milk cake"
//             />

//             <Field
//               label="Price"
//               name="product_price"
//               value={
//                 form.product_price
//               }
//               onChange={
//                 handleChange
//               }
//               placeholder="Rs. 2,200"
//             />

//           </div>
//         </div>

//         {/* =========================
//             FEATURES
//         ========================== */}

//         <div className="hero-admin-section">

//           <div className="hero-admin-section-title">
//             <Sparkles
//               size={19}
//             />

//             <div>
//               <h2>
//                 Bottom Features
//               </h2>

//               <p>
//                 Edit the three short
//                 features below the
//                 hero buttons.
//               </p>
//             </div>
//           </div>

//           <div className="hero-admin-form-grid three">

//             <Field
//               label="Feature 1"
//               name="feature_one"
//               value={
//                 form.feature_one
//               }
//               onChange={
//                 handleChange
//               }
//               placeholder="Freshly Baked"
//             />

//             <Field
//               label="Feature 2"
//               name="feature_two"
//               value={
//                 form.feature_two
//               }
//               onChange={
//                 handleChange
//               }
//               placeholder="Made With Love"
//             />

//             <Field
//               label="Feature 3"
//               name="feature_three"
//               value={
//                 form.feature_three
//               }
//               onChange={
//                 handleChange
//               }
//               placeholder="Custom Designs"
//             />

//           </div>
//         </div>


//         {/* =========================
//             HERO STYLE CUSTOMIZATION
//         ========================== */}

//         <div className="hero-admin-section">
//           <div className="hero-admin-section-title">
//             <Type size={19} />
//             <div>
//               <h2>Hero Text & Style Customization</h2>
//               <p>Change hero text colors, fonts and button colors.</p>
//             </div>
//           </div>

//           <div className="hero-admin-form-grid" style={{ marginTop: "24px" }}>
//             <ColorField label="Brand Small Text Color" name="hero_brand_small_color" value={form.hero_brand_small_color} onChange={handleChange} />
//             <ColorField label="Brand Title Color" name="hero_brand_title_color" value={form.hero_brand_title_color} onChange={handleChange} />
//             <ColorField label="Eyebrow Color" name="hero_eyebrow_color" value={form.hero_eyebrow_color} onChange={handleChange} />
//             <ColorField label="Heading Color" name="hero_heading_color" value={form.hero_heading_color} onChange={handleChange} />
//             <ColorField label="Highlight Color" name="hero_highlight_color" value={form.hero_highlight_color} onChange={handleChange} />
//             <ColorField label="Description Color" name="hero_subheading_color" value={form.hero_subheading_color} onChange={handleChange} />

//             <FontField label="Heading Font" name="hero_heading_font" value={form.hero_heading_font} onChange={handleChange} />
//             <FontField label="Body Font" name="hero_body_font" value={form.hero_body_font} onChange={handleChange} />

//             <ColorField label="Primary Button Text" name="hero_primary_text_color" value={form.hero_primary_text_color} onChange={handleChange} />
//             <ColorField label="Primary Button Background" name="hero_primary_bg_color" value={form.hero_primary_bg_color} onChange={handleChange} />
//             <ColorField label="Secondary Button Text" name="hero_secondary_text_color" value={form.hero_secondary_text_color} onChange={handleChange} />
//             <ColorField label="Secondary Button Background" name="hero_secondary_bg_color" value={form.hero_secondary_bg_color} onChange={handleChange} />
//           </div>
//         </div>

//         {/* =========================
//             CUSTOM CAKE SECTION
//         ========================== */}

//         <div className="hero-admin-section">
//           <div className="hero-admin-section-title">
//             <CakeSlice size={19} />
//             <div>
//               <h2>Custom Cake Section</h2>
//               <p>
//                 Manage the image, text and button shown in
//                 the “Made Just For You” section.
//               </p>
//             </div>
//           </div>

//           <div className="hero-admin-image-grid">
//             <div className="hero-admin-image-box">
//               <div className="hero-admin-field-title">
//                 Section Image
//               </div>

//               <div className="hero-admin-main-preview">
//                 {customImageSrc ? (
//                   <img src={customImageSrc} alt="Custom Cake Section" />
//                 ) : (
//                   <ImageIcon size={45} />
//                 )}

//                 {customFile && (
//                   <button
//                     type="button"
//                     className="hero-admin-remove"
//                     onClick={removeCustomSelection}
//                   >
//                     <X size={16} />
//                   </button>
//                 )}
//               </div>

//               <input
//                 ref={customImageInputRef}
//                 type="file"
//                 accept="image/jpeg,image/png,image/webp"
//                 hidden
//                 onChange={handleCustomImage}
//               />

//               <button
//                 type="button"
//                 className="hero-admin-upload"
//                 onClick={() =>
//                   customImageInputRef.current?.click()
//                 }
//               >
//                 <Upload size={17} />
//                 {customImageSrc
//                   ? "Change Section Image"
//                   : "Upload Section Image"}
//               </button>
//             </div>
//           </div>

//           <div
//             className="hero-admin-form-grid"
//             style={{ marginTop: "24px" }}
//           >
//             <Field
//               label="Small Heading"
//               name="custom_eyebrow"
//               value={form.custom_eyebrow}
//               onChange={handleChange}
//               placeholder="MADE JUST FOR YOU"
//             />

//             <Field
//               label="Heading Before Highlight"
//               name="custom_heading"
//               value={form.custom_heading}
//               onChange={handleChange}
//               placeholder="Have something"
//             />

//             <Field
//               label="Highlighted Text"
//               name="custom_heading_highlight"
//               value={form.custom_heading_highlight}
//               onChange={handleChange}
//               placeholder="special"
//             />

//             <Field
//               label="Heading After Highlight"
//               name="custom_heading_after"
//               value={form.custom_heading_after}
//               onChange={handleChange}
//               placeholder="in mind?"
//             />

//             <Field
//               label="Button Text"
//               name="custom_button_text"
//               value={form.custom_button_text}
//               onChange={handleChange}
//               placeholder="Create Your Cake"
//             />

//             <Field
//               label="Button Link"
//               name="custom_button_link"
//               value={form.custom_button_link}
//               onChange={handleChange}
//               placeholder="/cakes"
//             />

//             <div className="hero-admin-field full">
//               <label>Description</label>
//               <textarea
//                 name="custom_description"
//                 value={form.custom_description || ""}
//                 onChange={handleChange}
//                 rows={4}
//                 placeholder="Custom cake section description..."
//               />
//             </div>
//           </div>


//           <div className="hero-admin-section-title" style={{ marginTop: "30px" }}>
//             <Type size={19} />
//             <div>
//               <h2>Custom Section Styling</h2>
//               <p>Customize text colors, fonts and button appearance.</p>
//             </div>
//           </div>

//           <div className="hero-admin-form-grid" style={{ marginTop: "20px" }}>
//             <ColorField label="Eyebrow Color" name="custom_eyebrow_color" value={form.custom_eyebrow_color} onChange={handleChange} />
//             <ColorField label="Heading Color" name="custom_heading_color" value={form.custom_heading_color} onChange={handleChange} />
//             <ColorField label="Highlight Color" name="custom_highlight_color" value={form.custom_highlight_color} onChange={handleChange} />
//             <ColorField label="Description Color" name="custom_description_color" value={form.custom_description_color} onChange={handleChange} />
//             <FontField label="Heading Font" name="custom_heading_font" value={form.custom_heading_font} onChange={handleChange} />
//             <FontField label="Body Font" name="custom_body_font" value={form.custom_body_font} onChange={handleChange} />
//             <ColorField label="Button Text Color" name="custom_button_text_color" value={form.custom_button_text_color} onChange={handleChange} />
//             <ColorField label="Button Background" name="custom_button_bg_color" value={form.custom_button_bg_color} onChange={handleChange} />
//           </div>

//           <div
//             className="hero-admin-status"
//             style={{ marginTop: "24px" }}
//           >
//             <div className="hero-admin-status-left">
//               <div
//                 className={`hero-admin-status-icon ${
//                   form.custom_is_active === 1 ? "active" : ""
//                 }`}
//               >
//                 {form.custom_is_active === 1 ? (
//                   <Eye size={20} />
//                 ) : (
//                   <EyeOff size={20} />
//                 )}
//               </div>

//               <div>
//                 <strong>Custom Section Status</strong>
//                 <span>
//                   {form.custom_is_active === 1
//                     ? "Custom cake section is active and visible."
//                     : "Custom cake section is currently hidden."}
//                 </span>
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={toggleCustomStatus}
//               className={`hero-admin-toggle ${
//                 form.custom_is_active === 1 ? "active" : ""
//               }`}
//             >
//               <span />
//             </button>
//           </div>
//         </div>

//         {/* =========================
//             CUSTOM CAKE LIVE PREVIEW
//         ========================== */}

//         <div className="hero-admin-section">
//           <div className="hero-admin-section-title">
//             <Eye size={19} />

//             <div>
//               <h2>Custom Cake Section Preview</h2>
//               <p>
//                 Live preview of the “Made Just For You” section
//                 before saving.
//               </p>
//             </div>
//           </div>

//           <div
//             style={{
//               marginTop: "22px",
//               display: "grid",
//               gridTemplateColumns: "minmax(0, 1.15fr) minmax(0, 1fr)",
//               minHeight: "430px",
//               overflow: "hidden",
//               border: "1px solid #eadfd7",
//               background: "#f9f4ef",
//             }}
//             className="custom-section-admin-preview"
//           >
//             <div
//               style={{
//                 minHeight: "430px",
//                 background: "#eee8e2",
//               }}
//             >
//               {customImageSrc ? (
//                 <img
//                   src={customImageSrc}
//                   alt="Custom cake preview"
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     minHeight: "430px",
//                     display: "block",
//                     objectFit: "cover",
//                   }}
//                 />
//               ) : (
//                 <div
//                   style={{
//                     minHeight: "430px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     flexDirection: "column",
//                     gap: "10px",
//                     color: "#9c8b80",
//                   }}
//                 >
//                   <ImageIcon size={48} />
//                   <span>Upload section image to preview</span>
//                 </div>
//               )}
//             </div>

//             <div
//               style={{
//                 padding: "58px 52px",
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "center",
//                 background: "#fbf7f3",
//               }}
//             >
//               <span
//                 style={{
//                   marginBottom: "18px",
//                   color: form.custom_eyebrow_color || "#ad7359",
//                   fontSize: "11px",
//                   fontWeight: "700",
//                   letterSpacing: "4px",
//                   textTransform: "uppercase",
//                 }}
//               >
//                 {form.custom_eyebrow || "MADE JUST FOR YOU"}
//               </span>

//               <h2
//                 style={{
//                   margin: "0 0 24px",
//                   color: form.custom_heading_color || "#2c211c",
//                   fontFamily: form.custom_heading_font || "Georgia, 'Times New Roman', serif",
//                   fontSize: "clamp(34px, 3vw, 52px)",
//                   fontWeight: "500",
//                   lineHeight: "1.04",
//                   letterSpacing: "-1.2px",
//                 }}
//               >
//                 {form.custom_heading || "Have something"}
//                 <br />

//                 <em
//                   style={{
//                     color: form.custom_highlight_color || "#b9795d",
//                     fontWeight: "400",
//                   }}
//                 >
//                   {form.custom_heading_highlight || "special"}
//                 </em>{" "}

//                 {form.custom_heading_after || "in mind?"}
//               </h2>

//               <p
//                 style={{
//                   margin: "0 0 28px",
//                   maxWidth: "520px",
//                   color: form.custom_description_color || "#755f54",
//                   fontFamily: form.custom_body_font || "Arial, Helvetica, sans-serif",
//                   fontSize: "14px",
//                   lineHeight: "1.8",
//                 }}
//               >
//                 {form.custom_description ||
//                   "Tell us about your celebration and we'll help create a cake that feels uniquely yours."}
//               </p>

//               {form.custom_button_text && (
//                 <div>
//                   <span
//                     style={{
//                       display: "inline-flex",
//                       alignItems: "center",
//                       gap: "12px",
//                       padding: "15px 23px",
//                       background: form.custom_button_bg_color || "#2b211d",
//                       color: form.custom_button_text_color || "#ffffff",
//                       fontFamily: form.custom_body_font || "Arial, Helvetica, sans-serif",
//                       fontSize: "13px",
//                       fontWeight: "700",
//                     }}
//                   >
//                     {form.custom_button_text}
//                     <span aria-hidden="true">→</span>
//                   </span>
//                 </div>
//               )}

//               <div
//                 style={{
//                   marginTop: "28px",
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: "8px",
//                   color:
//                     form.custom_is_active === 1
//                       ? "#39734c"
//                       : "#9a554e",
//                   fontSize: "12px",
//                   fontWeight: "700",
//                 }}
//               >
//                 {form.custom_is_active === 1 ? (
//                   <Eye size={15} />
//                 ) : (
//                   <EyeOff size={15} />
//                 )}

//                 {form.custom_is_active === 1
//                   ? "Section is visible on website"
//                   : "Section is hidden on website"}
//               </div>
//             </div>
//           </div>

//           <style>{`
//             @media (max-width: 850px) {
//               .custom-section-admin-preview {
//                 grid-template-columns: 1fr !important;
//               }

//               .custom-section-admin-preview > div:first-child,
//               .custom-section-admin-preview > div:first-child img {
//                 min-height: 300px !important;
//                 max-height: 380px !important;
//               }

//               .custom-section-admin-preview > div:last-child {
//                 padding: 36px 28px !important;
//               }
//             }
//           `}</style>
//         </div>

//         {/* =========================
//             STATUS
//         ========================== */}

//         <div className="hero-admin-section">

//           <div className="hero-admin-status">

//             <div className="hero-admin-status-left">

//               <div
//                 className={`hero-admin-status-icon ${
//                   form.is_active === 1
//                     ? "active"
//                     : ""
//                 }`}
//               >
//                 {form.is_active === 1 ? (
//                   <Eye
//                     size={20}
//                   />
//                 ) : (
//                   <EyeOff
//                     size={20}
//                   />
//                 )}
//               </div>

//               <div>
//                 <strong>
//                   Hero Status
//                 </strong>

//                 <span>
//                   {form.is_active === 1
//                     ? "Hero section is active and visible."
//                     : "Hero section is currently hidden."}
//                 </span>
//               </div>

//             </div>

//             <button
//               type="button"
//               onClick={
//                 toggleStatus
//               }
//               className={`hero-admin-toggle ${
//                 form.is_active === 1
//                   ? "active"
//                   : ""
//               }`}
//             >
//               <span />
//             </button>

//           </div>

//         </div>

//         {/* =========================
//             LIVE PREVIEW
//         ========================== */}

//         <div className="hero-admin-section">

//           <div className="hero-admin-section-title">
//             <Eye size={19} />

//             <div>
//               <h2>
//                 Content Preview
//               </h2>

//               <p>
//                 Preview your current
//                 hero content before
//                 saving.
//               </p>
//             </div>
//           </div>

//           <div className="hero-admin-live-preview">

//             <div className="hero-admin-preview-left">

//               <small>
//                 {form.brand_small_text}
//               </small>

//               <h4>
//                 {form.brand_title}
//               </h4>

//               <span className="hero-admin-eyebrow">
//                 {form.eyebrow_text}
//               </span>

//               <h2>
//                 {form.heading}
//                 <em>
//                   {
//                     form.heading_highlight
//                   }
//                 </em>
//               </h2>

//               <p>
//                 {form.subheading}
//               </p>

//               <div className="hero-admin-preview-buttons">

//                 {form.button_text && (
//                   <span className="primary">
//                     {
//                       form.button_text
//                     }
//                   </span>
//                 )}

//                 {form.secondary_button_text && (
//                   <span className="secondary">
//                     {
//                       form.secondary_button_text
//                     }
//                   </span>
//                 )}

//               </div>

//               <div className="hero-admin-preview-features">

//                 <span>
//                   {form.feature_one}
//                 </span>

//                 <span>
//                   {form.feature_two}
//                 </span>

//                 <span>
//                   {form.feature_three}
//                 </span>

//               </div>

//             </div>

//             <div className="hero-admin-preview-right">

//               {mainImageSrc ? (
//                 <img
//                   className="hero-admin-preview-main-image"
//                   src={
//                     mainImageSrc
//                   }
//                   alt=""
//                 />
//               ) : (
//                 <div className="hero-admin-preview-no-image">
//                   <ImageIcon
//                     size={40}
//                   />
//                 </div>
//               )}

//               <span className="hero-admin-preview-vertical">
//                 {form.vertical_text}
//               </span>

//               <div className="hero-admin-preview-product">
//                 <small>
//                   {
//                     form.product_label
//                   }
//                 </small>

//                 <strong>
//                   {
//                     form.product_title
//                   }
//                 </strong>

//                 <span>
//                   Starting from
//                   <b>
//                     {
//                       form.product_price
//                     }
//                   </b>
//                 </span>
//               </div>

//               {secondaryImageSrc && (
//                 <img
//                   className="hero-admin-preview-secondary"
//                   src={
//                     secondaryImageSrc
//                   }
//                   alt=""
//                 />
//               )}

//             </div>

//           </div>

//         </div>

//         {/* SAVE */}

//         <div className="hero-admin-save-bar">

//           <div>
//             <strong>
//               Home Hero Settings
//             </strong>

//             <span>
//               Save changes to update
//               the home page.
//             </span>
//           </div>

//           <button
//             type="submit"
//             disabled={saving}
//           >
//             {saving ? (
//               <>
//                 <RefreshCw
//                   size={18}
//                   className="hero-admin-spin"
//                 />
//                 Saving...
//               </>
//             ) : (
//               <>
//                 <Save
//                   size={18}
//                 />
//                 Save Changes
//               </>
//             )}
//           </button>

//         </div>

//       </form>

//     </div>
//   );
// };

// /*
// |--------------------------------------------------------------------------
// | REUSABLE FIELD
// |--------------------------------------------------------------------------
// */


// const FONT_OPTIONS = [
//   ["Georgia, 'Times New Roman', serif", "Georgia / Classic Serif"],
//   ["'Playfair Display', Georgia, serif", "Playfair Display"],
//   ["'Times New Roman', Times, serif", "Times New Roman"],
//   ["Arial, Helvetica, sans-serif", "Arial"],
//   ["Inter, Arial, sans-serif", "Inter"],
//   ["Poppins, Arial, sans-serif", "Poppins"],
//   ["Montserrat, Arial, sans-serif", "Montserrat"],
//   ["'Trebuchet MS', Arial, sans-serif", "Trebuchet MS"],
// ];

// const ColorField = ({ label, name, value, onChange }) => (
//   <div className="hero-admin-field">
//     <label>{label}</label>
//     <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//       <input
//         type="color"
//         name={name}
//         value={value || "#000000"}
//         onChange={onChange}
//         style={{ width: "52px", height: "44px", padding: "3px", cursor: "pointer" }}
//       />
//       <input
//         type="text"
//         name={name}
//         value={value || ""}
//         onChange={onChange}
//         placeholder="#000000"
//         style={{ flex: 1 }}
//       />
//     </div>
//   </div>
// );

// const FontField = ({ label, name, value, onChange }) => (
//   <div className="hero-admin-field">
//     <label>{label}</label>
//     <select name={name} value={value || ""} onChange={onChange}>
//       {FONT_OPTIONS.map(([fontValue, fontLabel]) => (
//         <option key={fontValue} value={fontValue}>
//           {fontLabel}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// const Field = ({
//   label,
//   name,
//   value,
//   onChange,
//   placeholder,
// }) => {
//   return (
//     <div className="hero-admin-field">

//       <label>
//         {label}
//       </label>

//       <input
//         type="text"
//         name={name}
//         value={value || ""}
//         onChange={onChange}
//         placeholder={
//           placeholder
//         }
//       />

//     </div>
//   );
// };

// export default HomeBanner;




import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Image as ImageIcon,
  Upload,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  X,
  Type,
  Link as LinkIcon,
  CakeSlice,
  Sparkles,
} from "lucide-react";

const API_ROOT =
  "https://coreops.pk/cakes/api";

const emptyForm = {
  id: 0,

  image: "",
  image_url: "",

  secondary_image: "",
  secondary_image_url: "",

  brand_small_text:
    "JUST BAKE IT OFFICIAL",

  brand_title:
    "Fresh & Delicious Cakes",

  eyebrow_text:
    "HANDCRAFTED IN LAHORE",

  heading:
    "Cakes made for",

  heading_highlight:
    "beautiful moments.",

  subheading:
    "Elegant, handcrafted cakes made fresh with thoughtful details, premium ingredients and a little bit of magic.",

  button_text:
    "Explore Cakes",

  button_link:
    "/cakes",

  secondary_button_text:
    "Browse Collections",

  secondary_button_link:
    "/cakes",

  vertical_text:
    "made with love",

  product_label:
    "OUR FAVOURITE",

  product_title:
    "Lotus three milk cake",

  product_price:
    "Rs. 2,200",

  feature_one:
    "Freshly Baked",

  feature_two:
    "Made With Love",

  feature_three:
    "Custom Designs",


  hero_brand_small_color: "#8B5E3C",
  hero_brand_title_color: "#2C211C",
  hero_eyebrow_color: "#AD7359",
  hero_heading_color: "#2C211C",
  hero_highlight_color: "#B9795D",
  hero_subheading_color: "#755F54",
  hero_heading_font: "Georgia, 'Times New Roman', serif",
  hero_body_font: "Arial, Helvetica, sans-serif",
  hero_primary_text_color: "#FFFFFF",
  hero_primary_bg_color: "#2B211D",
  hero_secondary_text_color: "#2B211D",
  hero_secondary_bg_color: "#F6EDE5",

  custom_eyebrow_color: "#AD7359",
  custom_heading_color: "#2C211C",
  custom_highlight_color: "#B9795D",
  custom_description_color: "#755F54",
  custom_heading_font: "Georgia, 'Times New Roman', serif",
  custom_body_font: "Arial, Helvetica, sans-serif",
  custom_button_text_color: "#FFFFFF",
  custom_button_bg_color: "#2B211D",

  custom_image: "",
  custom_image_url: "",
  custom_eyebrow: "MADE JUST FOR YOU",
  custom_heading: "Have something",
  custom_heading_highlight: "special",
  custom_heading_after: "in mind?",
  custom_description:
    "Tell us about your celebration and we'll help create a cake that feels uniquely yours — from colours and flavours to every beautiful finishing detail.",
  custom_button_text: "Create Your Cake",
  custom_button_link: "/cakes",
  custom_is_active: 1,

  is_active: 1,
};

const HomeBanner = () => {
  const mainImageInputRef =
    useRef(null);

  const secondaryImageInputRef =
    useRef(null);

  const customImageInputRef =
    useRef(null);

  const [form, setForm] =
    useState(emptyForm);

  const [mainFile, setMainFile] =
    useState(null);

  const [
    secondaryFile,
    setSecondaryFile,
  ] = useState(null);

  const [customFile, setCustomFile] =
    useState(null);

  const [
    mainPreview,
    setMainPreview,
  ] = useState("");

  const [
    secondaryPreview,
    setSecondaryPreview,
  ] = useState("");

  const [customPreview, setCustomPreview] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD HERO
  |--------------------------------------------------------------------------
  */

  const loadBanner = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch(
        `${API_ROOT}/HomeBanner/get.php`
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        result.status !== "success"
      ) {
        throw new Error(
          result.message ||
            "Unable to load home hero."
        );
      }

      if (result.data) {
        setForm({
          ...emptyForm,
          ...result.data,

          id: Number(
            result.data.id || 0
          ),

          is_active:
            Number(
              result.data.is_active
            ) === 1
              ? 1
              : 0,

          image:
            result.data.image || "",

          image_url:
            result.data.image_url || "",

          secondary_image:
            result.data
              .secondary_image || "",

          secondary_image_url:
            result.data
              .secondary_image_url || "",

          custom_image:
            result.data.custom_image || "",

          custom_image_url:
            result.data.custom_image_url || "",

          custom_is_active:
            Number(result.data.custom_is_active) === 1
              ? 1
              : 0,
        });
      }
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error.message ||
          "Unable to load home hero."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanner();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CLEAN PREVIEWS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      if (mainPreview) {
        URL.revokeObjectURL(
          mainPreview
        );
      }
    };
  }, [mainPreview]);

  useEffect(() => {
    return () => {
      if (secondaryPreview) {
        URL.revokeObjectURL(
          secondaryPreview
        );
      }
    };
  }, [secondaryPreview]);

  useEffect(() => {
    return () => {
      if (customPreview) {
        URL.revokeObjectURL(customPreview);
      }
    };
  }, [customPreview]);

  /*
  |--------------------------------------------------------------------------
  | TEXT INPUT
  |--------------------------------------------------------------------------
  */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  };

  /*
  |--------------------------------------------------------------------------
  | IMAGE VALIDATION
  |--------------------------------------------------------------------------
  */

  const validateImage = (file) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setErrorMessage(
        "Only JPG, PNG and WEBP images are allowed."
      );

      return false;
    }

    if (
      file.size >
      8 * 1024 * 1024
    ) {
      setErrorMessage(
        "Image must be smaller than 8 MB."
      );

      return false;
    }

    return true;
  };

  /*
  |--------------------------------------------------------------------------
  | MAIN IMAGE
  |--------------------------------------------------------------------------
  */

  const handleMainImage = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!validateImage(file)) {
      event.target.value = "";
      return;
    }

    if (mainPreview) {
      URL.revokeObjectURL(
        mainPreview
      );
    }

    setMainFile(file);

    setMainPreview(
      URL.createObjectURL(file)
    );

    setSuccessMessage("");
    setErrorMessage("");
  };

  /*
  |--------------------------------------------------------------------------
  | SECONDARY IMAGE
  |--------------------------------------------------------------------------
  */

  const handleSecondaryImage = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!validateImage(file)) {
      event.target.value = "";
      return;
    }

    if (secondaryPreview) {
      URL.revokeObjectURL(
        secondaryPreview
      );
    }

    setSecondaryFile(file);

    setSecondaryPreview(
      URL.createObjectURL(file)
    );

    setSuccessMessage("");
    setErrorMessage("");
  };

  /*
  |--------------------------------------------------------------------------
  | CUSTOM SECTION IMAGE
  |--------------------------------------------------------------------------
  */

  const handleCustomImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateImage(file)) {
      event.target.value = "";
      return;
    }

    if (customPreview) {
      URL.revokeObjectURL(customPreview);
    }

    setCustomFile(file);
    setCustomPreview(URL.createObjectURL(file));
    setSuccessMessage("");
    setErrorMessage("");
  };

  /*
  |--------------------------------------------------------------------------
  | UPLOAD IMAGE
  |--------------------------------------------------------------------------
  */

  const uploadImage = async (
    file
  ) => {
    if (!file) {
      return null;
    }

    const data =
      new FormData();

    data.append(
      "image",
      file
    );

    const response =
      await fetch(
        `${API_ROOT}/HomeBanner/upload.php`,
        {
          method: "POST",
          body: data,
        }
      );

    const result =
      await response.json();

    if (
      !response.ok ||
      result.status !== "success"
    ) {
      throw new Error(
        result.message ||
          "Unable to upload image."
      );
    }

    return result;
  };

  /*
  |--------------------------------------------------------------------------
  | REMOVE NEW MAIN SELECTION
  |--------------------------------------------------------------------------
  */

  const removeMainSelection = () => {
    if (mainPreview) {
      URL.revokeObjectURL(
        mainPreview
      );
    }

    setMainFile(null);
    setMainPreview("");

    if (
      mainImageInputRef.current
    ) {
      mainImageInputRef.current.value =
        "";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | REMOVE SECONDARY SELECTION
  |--------------------------------------------------------------------------
  */

  const removeSecondarySelection =
    () => {
      if (secondaryPreview) {
        URL.revokeObjectURL(
          secondaryPreview
        );
      }

      setSecondaryFile(null);

      setSecondaryPreview("");

      if (
        secondaryImageInputRef.current
      ) {
        secondaryImageInputRef.current.value =
          "";
      }

      if (customImageInputRef.current) {
        customImageInputRef.current.value = "";
      }
    };

  const removeCustomSelection = () => {
    if (customPreview) {
      URL.revokeObjectURL(customPreview);
    }

    setCustomFile(null);
    setCustomPreview("");

    if (customImageInputRef.current) {
      customImageInputRef.current.value = "";
    }
  };

  const toggleCustomStatus = () => {
    setForm((previous) => ({
      ...previous,
      custom_is_active:
        previous.custom_is_active === 1 ? 0 : 1,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | STATUS
  |--------------------------------------------------------------------------
  */

  const toggleStatus = () => {
    setForm((previous) => ({
      ...previous,

      is_active:
        previous.is_active === 1
          ? 0
          : 1,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | SAVE
  |--------------------------------------------------------------------------
  */

  const handleSave = async (
    event
  ) => {
    event.preventDefault();

    if (saving) return;

    try {
      setSaving(true);

      setSuccessMessage("");
      setErrorMessage("");

      let mainImage =
        form.image;

      let mainImageUrl =
        form.image_url;

      let secondImage =
        form.secondary_image;

      let secondImageUrl =
        form.secondary_image_url;

      let customImage =
        form.custom_image;

      let customImageUrl =
        form.custom_image_url;

      /*
      | MAIN IMAGE
      */

      if (mainFile) {
        const uploaded =
          await uploadImage(
            mainFile
          );

        mainImage =
          uploaded.file_name;

        mainImageUrl =
          uploaded.image_url;
      }

      /*
      | SECONDARY IMAGE
      */

      if (secondaryFile) {
        const uploaded =
          await uploadImage(
            secondaryFile
          );

        secondImage =
          uploaded.file_name;

        secondImageUrl =
          uploaded.image_url;
      }

      /*
      | CUSTOM SECTION IMAGE
      */

      if (customFile) {
        const uploaded =
          await uploadImage(customFile);

        customImage =
          uploaded.file_name;

        customImageUrl =
          uploaded.image_url;
      }

      /*
      | SAVE TEXT + IMAGE NAMES
      */

      const payload = {
        id: Number(
          form.id || 0
        ),

        image:
          mainImage || "",

        secondary_image:
          secondImage || "",

        brand_small_text:
          form.brand_small_text.trim(),

        brand_title:
          form.brand_title.trim(),

        eyebrow_text:
          form.eyebrow_text.trim(),

        heading:
          form.heading.trim(),

        heading_highlight:
          form.heading_highlight.trim(),

        subheading:
          form.subheading.trim(),

        button_text:
          form.button_text.trim(),

        button_link:
          form.button_link.trim(),

        secondary_button_text:
          form.secondary_button_text.trim(),

        secondary_button_link:
          form.secondary_button_link.trim(),

        vertical_text:
          form.vertical_text.trim(),

        product_label:
          form.product_label.trim(),

        product_title:
          form.product_title.trim(),

        product_price:
          form.product_price.trim(),

        feature_one:
          form.feature_one.trim(),

        feature_two:
          form.feature_two.trim(),

        feature_three:
          form.feature_three.trim(),


        hero_brand_small_color: form.hero_brand_small_color,
        hero_brand_title_color: form.hero_brand_title_color,
        hero_eyebrow_color: form.hero_eyebrow_color,
        hero_heading_color: form.hero_heading_color,
        hero_highlight_color: form.hero_highlight_color,
        hero_subheading_color: form.hero_subheading_color,
        hero_heading_font: form.hero_heading_font,
        hero_body_font: form.hero_body_font,
        hero_primary_text_color: form.hero_primary_text_color,
        hero_primary_bg_color: form.hero_primary_bg_color,
        hero_secondary_text_color: form.hero_secondary_text_color,
        hero_secondary_bg_color: form.hero_secondary_bg_color,

        custom_eyebrow_color: form.custom_eyebrow_color,
        custom_heading_color: form.custom_heading_color,
        custom_highlight_color: form.custom_highlight_color,
        custom_description_color: form.custom_description_color,
        custom_heading_font: form.custom_heading_font,
        custom_body_font: form.custom_body_font,
        custom_button_text_color: form.custom_button_text_color,
        custom_button_bg_color: form.custom_button_bg_color,

        custom_image:
          customImage || "",

        custom_eyebrow:
          form.custom_eyebrow.trim(),

        custom_heading:
          form.custom_heading.trim(),

        custom_heading_highlight:
          form.custom_heading_highlight.trim(),

        custom_heading_after:
          form.custom_heading_after.trim(),

        custom_description:
          form.custom_description.trim(),

        custom_button_text:
          form.custom_button_text.trim(),

        custom_button_link:
          form.custom_button_link.trim(),

        custom_is_active:
          Number(form.custom_is_active),

        is_active:
          Number(
            form.is_active
          ),
      };

      const response =
        await fetch(
          `${API_ROOT}/HomeBanner/save.php`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload
            ),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        result.status !== "success"
      ) {
        throw new Error(
          result.message ||
            "Unable to save home hero."
        );
      }

      setForm(
        (previous) => ({
          ...previous,

          id: Number(
            result.id ||
              previous.id
          ),

          image:
            mainImage,

          image_url:
            mainImageUrl,

          secondary_image:
            secondImage,

          secondary_image_url:
            secondImageUrl,

          custom_image:
            customImage,

          custom_image_url:
            customImageUrl,
        })
      );

      setMainFile(null);
      setSecondaryFile(null);
      setCustomFile(null);

      setMainPreview("");
      setSecondaryPreview("");
      setCustomPreview("");

      if (
        mainImageInputRef.current
      ) {
        mainImageInputRef.current.value =
          "";
      }

      if (
        secondaryImageInputRef.current
      ) {
        secondaryImageInputRef.current.value =
          "";
      }

      if (customImageInputRef.current) {
        customImageInputRef.current.value = "";
      }

      setSuccessMessage(
        "Home hero updated successfully."
      );

      await loadBanner();

      setSuccessMessage(
        "Home hero updated successfully."
      );
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error.message ||
          "Unable to save home hero."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | REFRESH
  |--------------------------------------------------------------------------
  */

  const handleRefresh =
    async () => {
      removeMainSelection();
      removeSecondarySelection();
      removeCustomSelection();

      setSuccessMessage("");
      setErrorMessage("");

      await loadBanner();
    };

  const mainImageSrc =
    mainPreview ||
    form.image_url ||
    "";

  const secondaryImageSrc =
    secondaryPreview ||
    form.secondary_image_url ||
    "";

  const customImageSrc =
    customPreview ||
    form.custom_image_url ||
    "";

  if (loading) {
    return (
      <div className="hero-admin-loading">
        <RefreshCw
          size={30}
          className="hero-admin-spin"
        />

        <span>
          Loading Home Hero...
        </span>
      </div>
    );
  }

  return (
    <div className="hero-admin-page">

      {/* HEADER */}

      <div className="hero-admin-header">

        <div>
          <div className="hero-admin-heading-row">

            <div className="hero-admin-heading-icon">
              <ImageIcon
                size={22}
              />
            </div>

            <div>
              <h1>
                Home Hero
              </h1>

              <p>
                Manage the complete
                hero section displayed
                on your website.
              </p>
            </div>

          </div>
        </div>

        <button
          type="button"
          className="hero-admin-refresh"
          onClick={
            handleRefresh
          }
          disabled={saving}
        >
          <RefreshCw
            size={17}
          />

          Refresh
        </button>

      </div>

      {/* MESSAGES */}

      {successMessage && (
        <div className="hero-admin-alert success">
          <CheckCircle2
            size={18}
          />

          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="hero-admin-alert error">
          <AlertCircle
            size={18}
          />

          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* =========================================================
            SECTION 1 — MAIN HERO
        ========================================================== */}
        <section className="hb-editor-section">
          <div className="hb-editor-section-head">
            <div>
              <span className="hb-editor-kicker">SECTION 01</span>
              <h2>Main Hero Banner</h2>
              <p>Hero images, content, buttons, card and styling — all in one workspace.</p>
            </div>

            <div className="hb-editor-status-inline">
              <span>{form.is_active === 1 ? "Visible" : "Hidden"}</span>
              <button
                type="button"
                onClick={toggleStatus}
                className={`hero-admin-toggle ${form.is_active === 1 ? "active" : ""}`}
                aria-label="Toggle hero visibility"
              >
                <span />
              </button>
            </div>
          </div>

          <div className="hb-editor-workspace">
            <div className="hb-editor-controls">
              <EditorGroup title="Images" icon={<ImageIcon size={17} />}>
                <div className="hb-image-control-grid">
                  <ImageControl
                    title="Main Cake Image"
                    imageSrc={mainImageSrc}
                    inputRef={mainImageInputRef}
                    onChange={handleMainImage}
                    onRemove={removeMainSelection}
                    hasNewFile={Boolean(mainFile)}
                    buttonText={mainImageSrc ? "Change Main Image" : "Upload Main Image"}
                  />
                  <ImageControl
                    title="Secondary Image"
                    imageSrc={secondaryImageSrc}
                    inputRef={secondaryImageInputRef}
                    onChange={handleSecondaryImage}
                    onRemove={removeSecondarySelection}
                    hasNewFile={Boolean(secondaryFile)}
                    buttonText={secondaryImageSrc ? "Change Secondary Image" : "Upload Secondary Image"}
                  />
                </div>
              </EditorGroup>

              <EditorGroup title="Hero Content" icon={<Type size={17} />}>
                <div className="hero-admin-form-grid">
                  <Field label="Small Brand Text" name="brand_small_text" value={form.brand_small_text} onChange={handleChange} />
                  <Field label="Brand Title" name="brand_title" value={form.brand_title} onChange={handleChange} />
                  <Field label="Eyebrow Text" name="eyebrow_text" value={form.eyebrow_text} onChange={handleChange} />
                  <Field label="Main Heading" name="heading" value={form.heading} onChange={handleChange} />
                  <Field label="Highlighted Heading" name="heading_highlight" value={form.heading_highlight} onChange={handleChange} />
                  <Field label="Vertical Text" name="vertical_text" value={form.vertical_text} onChange={handleChange} />
                  <div className="hero-admin-field full">
                    <label>Description</label>
                    <textarea name="subheading" value={form.subheading || ""} onChange={handleChange} rows={4} />
                  </div>
                </div>
              </EditorGroup>

              <EditorGroup title="Buttons" icon={<LinkIcon size={17} />}>
                <div className="hero-admin-form-grid">
                  <Field label="Primary Button Text" name="button_text" value={form.button_text} onChange={handleChange} />
                  <Field label="Primary Button Link" name="button_link" value={form.button_link} onChange={handleChange} />
                  <Field label="Secondary Button Text" name="secondary_button_text" value={form.secondary_button_text} onChange={handleChange} />
                  <Field label="Secondary Button Link" name="secondary_button_link" value={form.secondary_button_link} onChange={handleChange} />
                </div>
              </EditorGroup>

              <EditorGroup title="Featured Cake Card" icon={<CakeSlice size={17} />}>
                <div className="hero-admin-form-grid">
                  <Field label="Card Label" name="product_label" value={form.product_label} onChange={handleChange} />
                  <Field label="Cake Name" name="product_title" value={form.product_title} onChange={handleChange} />
                  <Field label="Price" name="product_price" value={form.product_price} onChange={handleChange} />
                </div>
              </EditorGroup>

              <EditorGroup title="Bottom Features" icon={<Sparkles size={17} />}>
                <div className="hero-admin-form-grid">
                  <Field label="Feature 1" name="feature_one" value={form.feature_one} onChange={handleChange} />
                  <Field label="Feature 2" name="feature_two" value={form.feature_two} onChange={handleChange} />
                  <Field label="Feature 3" name="feature_three" value={form.feature_three} onChange={handleChange} />
                </div>
              </EditorGroup>

              <EditorGroup title="Colors & Fonts" icon={<Type size={17} />}>
                <div className="hero-admin-form-grid">
                  <ColorField label="Brand Small Text" name="hero_brand_small_color" value={form.hero_brand_small_color} onChange={handleChange} />
                  <ColorField label="Brand Title" name="hero_brand_title_color" value={form.hero_brand_title_color} onChange={handleChange} />
                  <ColorField label="Eyebrow" name="hero_eyebrow_color" value={form.hero_eyebrow_color} onChange={handleChange} />
                  <ColorField label="Heading" name="hero_heading_color" value={form.hero_heading_color} onChange={handleChange} />
                  <ColorField label="Highlight" name="hero_highlight_color" value={form.hero_highlight_color} onChange={handleChange} />
                  <ColorField label="Description" name="hero_subheading_color" value={form.hero_subheading_color} onChange={handleChange} />
                  <FontField label="Heading Font" name="hero_heading_font" value={form.hero_heading_font} onChange={handleChange} />
                  <FontField label="Body Font" name="hero_body_font" value={form.hero_body_font} onChange={handleChange} />
                  <ColorField label="Primary Button Text" name="hero_primary_text_color" value={form.hero_primary_text_color} onChange={handleChange} />
                  <ColorField label="Primary Button Background" name="hero_primary_bg_color" value={form.hero_primary_bg_color} onChange={handleChange} />
                  <ColorField label="Secondary Button Text" name="hero_secondary_text_color" value={form.hero_secondary_text_color} onChange={handleChange} />
                  <ColorField label="Secondary Button Background" name="hero_secondary_bg_color" value={form.hero_secondary_bg_color} onChange={handleChange} />
                </div>
              </EditorGroup>
            </div>

            <div className="hb-editor-preview-column">
              <div className="hb-editor-sticky-preview">
                <div className="hb-editor-preview-label">
                  <Eye size={16} />
                  Live Hero Preview
                </div>

                <div className="hero-admin-live-preview hb-hero-preview">
                  <div
                    className="hero-admin-preview-left"
                    style={{ fontFamily: form.hero_body_font || undefined }}
                  >
                    <small style={{ color: form.hero_brand_small_color }}>{form.brand_small_text}</small>
                    <h4 style={{ color: form.hero_brand_title_color }}>{form.brand_title}</h4>
                    <span className="hero-admin-eyebrow" style={{ color: form.hero_eyebrow_color }}>
                      {form.eyebrow_text}
                    </span>
                    <h2 style={{ color: form.hero_heading_color, fontFamily: form.hero_heading_font }}>
                      {form.heading}
                      <em style={{ color: form.hero_highlight_color }}>{form.heading_highlight}</em>
                    </h2>
                    <p style={{ color: form.hero_subheading_color }}>{form.subheading}</p>

                    <div className="hero-admin-preview-buttons">
                      {form.button_text && (
                        <span
                          className="primary"
                          style={{ color: form.hero_primary_text_color, background: form.hero_primary_bg_color }}
                        >
                          {form.button_text}
                        </span>
                      )}
                      {form.secondary_button_text && (
                        <span
                          className="secondary"
                          style={{ color: form.hero_secondary_text_color, background: form.hero_secondary_bg_color }}
                        >
                          {form.secondary_button_text}
                        </span>
                      )}
                    </div>

                    <div className="hero-admin-preview-features">
                      <span>{form.feature_one}</span>
                      <span>{form.feature_two}</span>
                      <span>{form.feature_three}</span>
                    </div>
                  </div>

                  <div className="hero-admin-preview-right">
                    {mainImageSrc ? (
                      <img className="hero-admin-preview-main-image" src={mainImageSrc} alt="" />
                    ) : (
                      <div className="hero-admin-preview-no-image"><ImageIcon size={40} /></div>
                    )}

                    <span className="hero-admin-preview-vertical">{form.vertical_text}</span>

                    <div className="hero-admin-preview-product">
                      <small>{form.product_label}</small>
                      <strong>{form.product_title}</strong>
                      <span>Starting from <b>{form.product_price}</b></span>
                    </div>

                    {secondaryImageSrc && (
                      <img className="hero-admin-preview-secondary" src={secondaryImageSrc} alt="" />
                    )}
                  </div>
                </div>

                <p className="hb-editor-preview-note">
                  Changes appear here instantly. Save only when you are happy with the result.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 2 — CUSTOM CAKE BANNER
        ========================================================== */}
        <section className="hb-editor-section">
          <div className="hb-editor-section-head">
            <div>
              <span className="hb-editor-kicker">SECTION 02</span>
              <h2>Custom Cake Banner</h2>
              <p>Everything for the “Made Just For You” banner is grouped here.</p>
            </div>

            <div className="hb-editor-status-inline">
              <span>{form.custom_is_active === 1 ? "Visible" : "Hidden"}</span>
              <button
                type="button"
                onClick={toggleCustomStatus}
                className={`hero-admin-toggle ${form.custom_is_active === 1 ? "active" : ""}`}
                aria-label="Toggle custom section visibility"
              >
                <span />
              </button>
            </div>
          </div>

          <div className="hb-editor-workspace">
            <div className="hb-editor-controls">
              <EditorGroup title="Banner Image" icon={<ImageIcon size={17} />}>
                <ImageControl
                  title="Custom Cake Section Image"
                  imageSrc={customImageSrc}
                  inputRef={customImageInputRef}
                  onChange={handleCustomImage}
                  onRemove={removeCustomSelection}
                  hasNewFile={Boolean(customFile)}
                  buttonText={customImageSrc ? "Change Section Image" : "Upload Section Image"}
                  wide
                />
              </EditorGroup>

              <EditorGroup title="Content" icon={<Type size={17} />}>
                <div className="hero-admin-form-grid">
                  <Field label="Small Heading" name="custom_eyebrow" value={form.custom_eyebrow} onChange={handleChange} />
                  <Field label="Heading Before Highlight" name="custom_heading" value={form.custom_heading} onChange={handleChange} />
                  <Field label="Highlighted Text" name="custom_heading_highlight" value={form.custom_heading_highlight} onChange={handleChange} />
                  <Field label="Heading After Highlight" name="custom_heading_after" value={form.custom_heading_after} onChange={handleChange} />
                  <Field label="Button Text" name="custom_button_text" value={form.custom_button_text} onChange={handleChange} />
                  <Field label="Button Link" name="custom_button_link" value={form.custom_button_link} onChange={handleChange} />
                  <div className="hero-admin-field full">
                    <label>Description</label>
                    <textarea
                      name="custom_description"
                      value={form.custom_description || ""}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>
                </div>
              </EditorGroup>

              <EditorGroup title="Colors & Fonts" icon={<Type size={17} />}>
                <div className="hero-admin-form-grid">
                  <ColorField label="Eyebrow" name="custom_eyebrow_color" value={form.custom_eyebrow_color} onChange={handleChange} />
                  <ColorField label="Heading" name="custom_heading_color" value={form.custom_heading_color} onChange={handleChange} />
                  <ColorField label="Highlight" name="custom_highlight_color" value={form.custom_highlight_color} onChange={handleChange} />
                  <ColorField label="Description" name="custom_description_color" value={form.custom_description_color} onChange={handleChange} />
                  <FontField label="Heading Font" name="custom_heading_font" value={form.custom_heading_font} onChange={handleChange} />
                  <FontField label="Body Font" name="custom_body_font" value={form.custom_body_font} onChange={handleChange} />
                  <ColorField label="Button Text" name="custom_button_text_color" value={form.custom_button_text_color} onChange={handleChange} />
                  <ColorField label="Button Background" name="custom_button_bg_color" value={form.custom_button_bg_color} onChange={handleChange} />
                </div>
              </EditorGroup>
            </div>

            <div className="hb-editor-preview-column">
              <div className="hb-editor-sticky-preview">
                <div className="hb-editor-preview-label">
                  <Eye size={16} />
                  Live Custom Banner Preview
                </div>

                <div className="hb-custom-preview">
                  <div className="hb-custom-preview-image">
                    {customImageSrc ? (
                      <img src={customImageSrc} alt="Custom cake preview" />
                    ) : (
                      <div className="hb-custom-preview-empty">
                        <ImageIcon size={44} />
                        <span>Upload section image</span>
                      </div>
                    )}
                  </div>

                  <div
                    className="hb-custom-preview-content"
                    style={{ fontFamily: form.custom_body_font || undefined }}
                  >
                    <span
                      className="hb-custom-eyebrow"
                      style={{ color: form.custom_eyebrow_color }}
                    >
                      {form.custom_eyebrow || "MADE JUST FOR YOU"}
                    </span>

                    <h2
                      style={{
                        color: form.custom_heading_color,
                        fontFamily: form.custom_heading_font,
                      }}
                    >
                      {form.custom_heading || "Have something"}
                      <br />
                      <em style={{ color: form.custom_highlight_color }}>
                        {form.custom_heading_highlight || "special"}
                      </em>{" "}
                      {form.custom_heading_after || "in mind?"}
                    </h2>

                    <p style={{ color: form.custom_description_color }}>
                      {form.custom_description}
                    </p>

                    {form.custom_button_text && (
                      <span
                        className="hb-custom-button"
                        style={{
                          color: form.custom_button_text_color,
                          background: form.custom_button_bg_color,
                        }}
                      >
                        {form.custom_button_text}
                        <span aria-hidden="true">→</span>
                      </span>
                    )}
                  </div>
                </div>

                <p className="hb-editor-preview-note">
                  This preview stays visible while you edit the controls on the left.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="hero-admin-save-bar hb-editor-save-bar">
          <div>
            <strong>Home Page Banner Settings</strong>
            <span>Save both sections after finishing your changes.</span>
          </div>

          <button type="submit" disabled={saving}>
            {saving ? (
              <>
                <RefreshCw size={18} className="hero-admin-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>

      <style>{`
        .hb-editor-section {
          margin: 0 0 30px;
          padding: 24px;
          border: 1px solid #eadfd7;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 8px 28px rgba(63, 43, 31, 0.05);
        }

        .hb-editor-section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding-bottom: 20px;
          margin-bottom: 22px;
          border-bottom: 1px solid #eee4dc;
        }

        .hb-editor-section-head h2 {
          margin: 4px 0 5px;
          color: #2c211c;
          font-size: 23px;
        }

        .hb-editor-section-head p {
          margin: 0;
          color: #87766b;
          font-size: 13px;
        }

        .hb-editor-kicker {
          color: #b9795d;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .hb-editor-status-inline {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #6f5d52;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .hb-editor-workspace {
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(430px, 1.05fr);
          gap: 24px;
          align-items: start;
        }

        .hb-editor-controls {
          display: flex;
          flex-direction: column;
          gap: 14px;
          min-width: 0;
        }

        .hb-editor-group {
          overflow: hidden;
          border: 1px solid #eadfd7;
          border-radius: 14px;
          background: #fffdfb;
        }

        .hb-editor-group-title {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 13px 16px;
          border-bottom: 1px solid #eee4dc;
          background: #faf6f2;
          color: #4c3930;
          font-size: 13px;
          font-weight: 800;
        }

        .hb-editor-group-body {
          padding: 16px;
        }

        .hb-editor-group .hero-admin-form-grid {
          margin-top: 0 !important;
        }

        .hb-image-control-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .hb-image-control {
          min-width: 0;
        }

        .hb-image-control.wide {
          max-width: 100%;
        }

        .hb-image-control-preview {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 155px;
          margin: 8px 0 10px;
          overflow: hidden;
          border: 1px dashed #d9c9bd;
          border-radius: 12px;
          background: #f6f0eb;
          color: #a28f83;
        }

        .hb-image-control.wide .hb-image-control-preview {
          height: 220px;
        }

        .hb-image-control-preview img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .hb-image-control .hero-admin-upload {
          width: 100%;
          justify-content: center;
        }

        .hb-editor-preview-column {
          min-width: 0;
        }

        .hb-editor-sticky-preview {
          position: sticky;
          top: 18px;
          border: 1px solid #e4d8cf;
          border-radius: 16px;
          background: #fbf7f3;
          overflow: hidden;
        }

        .hb-editor-preview-label {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 15px;
          border-bottom: 1px solid #e7dcd3;
          background: #f4ece6;
          color: #5c463a;
          font-size: 12px;
          font-weight: 800;
        }

        .hb-hero-preview {
          margin: 0 !important;
          border: 0 !important;
          border-radius: 0 !important;
          min-height: 470px;
        }

        .hb-editor-preview-note {
          margin: 0;
          padding: 11px 15px;
          border-top: 1px solid #e7dcd3;
          color: #8a776c;
          font-size: 11px;
          line-height: 1.5;
        }

        .hb-custom-preview {
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          min-height: 470px;
        }

        .hb-custom-preview-image {
          min-height: 470px;
          background: #eee8e2;
        }

        .hb-custom-preview-image img {
          width: 100%;
          height: 100%;
          min-height: 470px;
          display: block;
          object-fit: cover;
        }

        .hb-custom-preview-empty {
          min-height: 470px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 10px;
          color: #9c8b80;
          font-size: 12px;
        }

        .hb-custom-preview-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 38px 32px;
          background: #fbf7f3;
        }

        .hb-custom-eyebrow {
          margin-bottom: 15px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .hb-custom-preview-content h2 {
          margin: 0 0 18px;
          font-size: clamp(28px, 2.6vw, 44px);
          font-weight: 500;
          line-height: 1.04;
        }

        .hb-custom-preview-content h2 em {
          font-weight: 400;
        }

        .hb-custom-preview-content p {
          margin: 0 0 24px;
          font-size: 13px;
          line-height: 1.75;
        }

        .hb-custom-button {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 18px;
          font-size: 12px;
          font-weight: 800;
        }

        .hb-editor-save-bar {
          position: sticky;
          bottom: 12px;
          z-index: 20;
          border: 1px solid #e4d8cf;
          border-radius: 14px;
          box-shadow: 0 12px 30px rgba(45, 31, 23, 0.12);
        }

        @media (max-width: 1180px) {
          .hb-editor-workspace {
            grid-template-columns: minmax(0, 1fr) minmax(380px, 0.9fr);
          }

          .hb-custom-preview {
            grid-template-columns: 1fr;
          }

          .hb-custom-preview-image,
          .hb-custom-preview-image img,
          .hb-custom-preview-empty {
            min-height: 300px;
            max-height: 330px;
          }
        }

        @media (max-width: 900px) {
          .hb-editor-section {
            padding: 18px;
          }

          .hb-editor-workspace {
            grid-template-columns: 1fr;
          }

          .hb-editor-sticky-preview {
            position: relative;
            top: auto;
          }

          .hb-editor-preview-column {
            order: -1;
          }

          .hb-hero-preview {
            min-height: auto;
          }
        }

        @media (max-width: 600px) {
          .hb-editor-section {
            padding: 14px;
            border-radius: 14px;
          }

          .hb-editor-section-head {
            align-items: flex-start;
            flex-direction: column;
          }

          .hb-image-control-grid {
            grid-template-columns: 1fr;
          }

          .hb-custom-preview-content {
            padding: 30px 22px;
          }

          .hb-editor-save-bar {
            bottom: 6px;
          }
        }
      `}</style>

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| REUSABLE FIELD
|--------------------------------------------------------------------------
*/



const EditorGroup = ({ title, icon, children }) => (
  <div className="hb-editor-group">
    <div className="hb-editor-group-title">
      {icon}
      <span>{title}</span>
    </div>
    <div className="hb-editor-group-body">{children}</div>
  </div>
);

const ImageControl = ({
  title,
  imageSrc,
  inputRef,
  onChange,
  onRemove,
  hasNewFile,
  buttonText,
  wide = false,
}) => (
  <div className={`hb-image-control ${wide ? "wide" : ""}`}>
    <div className="hero-admin-field-title">{title}</div>
    <div className="hb-image-control-preview">
      {imageSrc ? <img src={imageSrc} alt={title} /> : <ImageIcon size={38} />}
      {hasNewFile && (
        <button type="button" className="hero-admin-remove" onClick={onRemove}>
          <X size={16} />
        </button>
      )}
    </div>

    <input
      ref={inputRef}
      type="file"
      accept="image/jpeg,image/png,image/webp"
      hidden
      onChange={onChange}
    />

    <button
      type="button"
      className="hero-admin-upload"
      onClick={() => inputRef.current?.click()}
    >
      <Upload size={16} />
      {buttonText}
    </button>
  </div>
);

const FONT_OPTIONS = [
  ["Georgia, 'Times New Roman', serif", "Georgia / Classic Serif"],
  ["'Playfair Display', Georgia, serif", "Playfair Display"],
  ["'Times New Roman', Times, serif", "Times New Roman"],
  ["Arial, Helvetica, sans-serif", "Arial"],
  ["Inter, Arial, sans-serif", "Inter"],
  ["Poppins, Arial, sans-serif", "Poppins"],
  ["Montserrat, Arial, sans-serif", "Montserrat"],
  ["'Trebuchet MS', Arial, sans-serif", "Trebuchet MS"],
];

const ColorField = ({ label, name, value, onChange }) => (
  <div className="hero-admin-field">
    <label>{label}</label>
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <input
        type="color"
        name={name}
        value={value || "#000000"}
        onChange={onChange}
        style={{ width: "52px", height: "44px", padding: "3px", cursor: "pointer" }}
      />
      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder="#000000"
        style={{ flex: 1 }}
      />
    </div>
  </div>
);

const FontField = ({ label, name, value, onChange }) => (
  <div className="hero-admin-field">
    <label>{label}</label>
    <select name={name} value={value || ""} onChange={onChange}>
      {FONT_OPTIONS.map(([fontValue, fontLabel]) => (
        <option key={fontValue} value={fontValue}>
          {fontLabel}
        </option>
      ))}
    </select>
  </div>
);

const Field = ({
  label,
  name,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="hero-admin-field">

      <label>
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={
          placeholder
        }
      />

    </div>
  );
};

export default HomeBanner;