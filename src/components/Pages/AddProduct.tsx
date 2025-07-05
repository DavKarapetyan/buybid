import React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  MapPin,
  Tag,
  DollarSign,
  Package,
  Camera,
  AlertCircle,
  Check,
  FileText,
  File,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../Auth/AuthContext";

interface AddProductProps {
  onNavigate: (page: string) => void;
}

interface ProductFormData {
  Name: string;
  Description: string;
  Price: number | "";
  CategoryId: number | "";
  CreatedByUserId: string;
  City: string;
  Status: string;
  Region: string;
  Images: File[];
  Model?: File;
  AttributesJson: string;
}

interface Category {
  id: number;
  name: string;
}

interface Attribute {
  id: number;
  name: string;
  type: string;
  required: boolean;
  options?: string[];
}

export default function AddProduct({ onNavigate }: AddProductProps) {
  const [formData, setFormData] = React.useState<ProductFormData>({
    Name: "",
    Description: "",
    Price: "",
    CategoryId: "",
    CreatedByUserId: "",
    City: "",
    Status: "active",
    Region: "",
    Images: [],
    Model: undefined,
    AttributesJson: "[]",
  });
  const { user } = useAuth();

  formData.CreatedByUserId = user?.id ?? "";

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [attributes, setAttributes] = React.useState<Attribute[]>([]);
  const [attributeValues, setAttributeValues] = React.useState<
    { AttributeDefinitionId: number; Value: string }[]
  >([]);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);
  const [modelDragActive, setModelDragActive] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState({
    categories: false,
    attributes: false,
  });

  const totalSteps = 5;

  // Accepted model file types
  const acceptedModelTypes = [
    ".glb",
    ".gltf",
    ".obj",
    ".fbx",
    ".dae",
    ".3ds",
    ".blend",
    ".max",
    ".ma",
    ".mb",
  ];

  // Step titles for mobile
  const stepTitles = ["Basic Info", "Pricing", "Images", "3D Model", "Details"];

  // Fetch categories on component mount
  React.useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch attributes when category changes
  React.useEffect(() => {
    if (formData.CategoryId) {
      fetchAttributes(formData.CategoryId as number);
    } else {
      setAttributes([]);
      setAttributeValues([]);
    }
  }, [formData.CategoryId]);

  // Update AttributesJson when attribute values change
  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      AttributesJson: JSON.stringify(attributeValues),
    }));
  }, [attributeValues]);

  const fetchCategories = async () => {
    setLoading((prev) => ({ ...prev, categories: true }));
    try {
      const response = await fetch(
        "https://seregamars-001-site9.ntempurl.com/categories"
      );
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }));
    }
  };

  const fetchAttributes = async (categoryId: number) => {
    setLoading((prev) => ({ ...prev, attributes: true }));
    try {
      const response = await fetch(
        `https://seregamars-001-site9.ntempurl.com/definitions/${categoryId}`
      );
      if (response.ok) {
        const data = await response.json();
        setAttributes(data);
        setAttributeValues([]);
      } else {
        console.error("Failed to fetch attributes");
      }
    } catch (error) {
      console.error("Error fetching attributes:", error);
    } finally {
      setLoading((prev) => ({ ...prev, attributes: false }));
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleAttributeChange = (attributeId: number, value: string) => {
    setAttributeValues((prev) => {
      const existingIndex = prev.findIndex(
        (attr) => attr.AttributeDefinitionId === attributeId
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        if (value.trim() === "") {
          updated.splice(existingIndex, 1);
        } else {
          updated[existingIndex] = {
            AttributeDefinitionId: attributeId,
            Value: value,
          };
        }
        return updated;
      } else {
        if (value.trim() !== "") {
          return [
            ...prev,
            { AttributeDefinitionId: attributeId, Value: value },
          ];
        }
        return prev;
      }
    });
  };

  const getAttributeValue = (attributeId: number): string => {
    const found = attributeValues.find(
      (attr) => attr.AttributeDefinitionId === attributeId
    );
    return found ? found.Value : "";
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const newImages = Array.from(files).filter((file) => {
      if (file.type.startsWith("image/")) {
        return true;
      }
      return false;
    });

    setFormData((prev) => ({
      ...prev,
      Images: [...prev.Images, ...newImages].slice(0, 8),
    }));
  };

  const handleModelUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));

    if (!acceptedModelTypes.includes(fileExtension)) {
      setErrors((prev) => ({
        ...prev,
        Model: `Invalid file type. Accepted formats: ${acceptedModelTypes.join(
          ", "
        )}`,
      }));
      return;
    }

    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        Model: "File size must be less than 100MB",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      Model: file,
    }));

    // Clear any existing errors
    setErrors((prev) => ({ ...prev, Model: "" }));
  };

  const removeModel = () => {
    setFormData((prev) => ({
      ...prev,
      Model: undefined,
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      Images: prev.Images.filter((_, i) => i !== index),
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleModelDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setModelDragActive(true);
    } else if (e.type === "dragleave") {
      setModelDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const handleModelDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setModelDragActive(false);
    handleModelUpload(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.Name.trim()) newErrors.Name = "Product name is required";
        if (!formData.Description.trim())
          newErrors.Description = "Description is required";
        if (!formData.CategoryId) newErrors.CategoryId = "Category is required";
        break;
      case 2:
        if (!formData.Price) newErrors.Price = "Price is required";
        if (isNaN(Number(formData.Price)))
          newErrors.Price = "Price must be a valid number";
        if (Number(formData.Price) <= 0)
          newErrors.Price = "Price must be greater than 0";
        break;
      case 3:
        if (formData.Images.length === 0)
          newErrors.Images = "At least one image is required";
        break;
      case 4:
        // Model upload is optional, no validation needed
        break;
      case 5:
        if (!formData.City.trim()) newErrors.City = "City is required";
        if (!formData.Region.trim()) newErrors.Region = "Region is required";

        attributes.forEach((attr) => {
          if (attr.required) {
            const value = getAttributeValue(attr.id);
            if (!value.trim()) {
              newErrors[`attribute_${attr.id}`] = `${attr.name} is required`;
            }
          }
        });
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Add text fields
      formDataToSend.append("Name", formData.Name);
      formDataToSend.append("Description", formData.Description);
      formDataToSend.append("Price", formData.Price.toString());
      formDataToSend.append("CategoryId", formData.CategoryId.toString());
      formDataToSend.append("CreatedByUserId", formData.CreatedByUserId);
      formDataToSend.append("City", formData.City);
      formDataToSend.append("Status", formData.Status);
      formDataToSend.append("Region", formData.Region);
      formDataToSend.append("AttributesJson", formData.AttributesJson);

      // Add images
      formData.Images.forEach((image, index) => {
        formDataToSend.append("Images", image);
      });

      // Add model if present
      if (formData.Model) {
        formDataToSend.append("Model", formData.Model);
      }

      const response = await fetch(
        "https://seregamars-001-site9.ntempurl.com/products",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (response.ok) {
        alert("Product added successfully!");
        onNavigate("dashboard");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to add product"}`);
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      alert("Error submitting product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.Name}
                onChange={(e) => handleInputChange("Name", e.target.value)}
                placeholder="Enter product name"
                className={`w-full px-3 py-3 sm:px-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-base ${
                  errors.Name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.Name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                  {errors.Name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.Description}
                onChange={(e) =>
                  handleInputChange("Description", e.target.value)
                }
                placeholder="Describe your product in detail"
                rows={4}
                className={`w-full px-3 py-3 sm:px-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none text-base ${
                  errors.Description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.Description && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                  {errors.Description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.CategoryId}
                onChange={(e) =>
                  handleInputChange("CategoryId", Number(e.target.value))
                }
                disabled={loading.categories}
                className={`w-full px-3 py-3 sm:px-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-base ${
                  errors.CategoryId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">
                  {loading.categories
                    ? "Loading categories..."
                    : "Select a category"}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.CategoryId && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                  {errors.CategoryId}
                </p>
              )}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price * <span className="text-gray-500">($)</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.Price}
                  onChange={(e) =>
                    handleInputChange(
                      "Price",
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={`w-full pl-10 pr-3 py-3 sm:pr-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-base ${
                    errors.Price ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.Price && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                  {errors.Price}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.Status}
                onChange={(e) => handleInputChange("Status", e.target.value)}
                className="w-full px-3 py-3 sm:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-base"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images *{" "}
                <span className="text-gray-500">(Max 8 images)</span>
              </label>

              <div
                className={`relative border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors ${
                  dragActive
                    ? "border-primary-500 bg-primary-50"
                    : errors.Images
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Camera className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                  Drop images here or tap to upload
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </div>

              {errors.Images && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                  {errors.Images}
                </p>
              )}

              {formData.Images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
                  {formData.Images.map((image, index) => (
                    <motion.div
                      key={index}
                      className="relative group"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 sm:h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                          Main
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3D Model <span className="text-gray-500">(Optional)</span>
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Upload a 3D model to enhance your product listing. Supported
                formats: {acceptedModelTypes.slice(0, 3).join(", ")} and more
              </p>

              {!formData.Model ? (
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors ${
                    modelDragActive
                      ? "border-primary-500 bg-primary-50"
                      : errors.Model
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleModelDrag}
                  onDragLeave={handleModelDrag}
                  onDragOver={handleModelDrag}
                  onDrop={handleModelDrop}
                >
                  <input
                    type="file"
                    accept={acceptedModelTypes.join(",")}
                    onChange={(e) => handleModelUpload(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <p className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                    Drop 3D model here or tap to upload
                  </p>
                  <p className="text-sm text-gray-500">
                    GLB, GLTF, OBJ, FBX and other formats up to 100MB
                  </p>
                </div>
              ) : (
                <motion.div
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="flex-shrink-0">
                        <File className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {formData.Model.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(formData.Model.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeModel}
                      className="flex-shrink-0 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {errors.Model && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                  {errors.Model}
                </p>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">
                      3D Model Tips
                    </h4>
                    <ul className="mt-2 text-sm text-blue-800 space-y-1">
                      <li>
                        • GLB/GLTF formats are recommended for best
                        compatibility
                      </li>
                      <li>• Keep file size under 100MB for optimal loading</li>
                      <li>
                        • Models will be displayed in an interactive 3D viewer
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.City}
                    onChange={(e) => handleInputChange("City", e.target.value)}
                    placeholder="Enter city"
                    className={`w-full pl-10 pr-3 py-3 sm:pr-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-base ${
                      errors.City ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.City && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                    {errors.City}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region *
                </label>
                <input
                  type="text"
                  value={formData.Region}
                  onChange={(e) => handleInputChange("Region", e.target.value)}
                  placeholder="Enter region/state"
                  className={`w-full px-3 py-3 sm:px-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-base ${
                    errors.Region ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.Region && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                    {errors.Region}
                  </p>
                )}
              </div>
            </div>

            {/* Category Attributes */}
            {attributes.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Product Attributes
                </h3>
                {loading.attributes ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {attributes.map((attribute) => (
                      <div key={attribute.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {attribute.name} {attribute.required && "*"}
                        </label>
                        {attribute.options && attribute.options.length > 0 ? (
                          <select
                            value={getAttributeValue(attribute.id)}
                            onChange={(e) =>
                              handleAttributeChange(
                                attribute.id,
                                e.target.value
                              )
                            }
                            className={`w-full px-3 py-3 sm:px-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-base ${
                              errors[`attribute_${attribute.id}`]
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          >
                            <option value="">Select {attribute.name}</option>
                            {attribute.options.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={getAttributeValue(attribute.id)}
                            onChange={(e) =>
                              handleAttributeChange(
                                attribute.id,
                                e.target.value
                              )
                            }
                            placeholder={`Enter ${attribute.name}`}
                            className={`w-full px-3 py-3 sm:px-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-base ${
                              errors[`attribute_${attribute.id}`]
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                        )}
                        {errors[`attribute_${attribute.id}`] && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                            {errors[`attribute_${attribute.id}`]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-4 sm:mb-6 transition-colors p-2 -ml-2 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm sm:text-base">Back to Dashboard</span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Add New Product
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Create a listing to sell your item
          </p>
        </motion.div>

        {/* Mobile Step Indicator */}
        <motion.div
          className="mb-6 sm:mb-8 lg:hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-900">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {stepTitles[currentStep - 1]}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </motion.div>

        {/* Desktop Progress Bar */}
        <motion.div
          className="mb-8 hidden lg:block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step <= currentStep
                      ? "bg-primary-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step < currentStep ? <Check className="h-5 w-5" /> : step}
                </div>
                {step < totalSteps && (
                  <div
                    className={`w-16 h-1 mx-2 transition-colors ${
                      step < currentStep ? "bg-primary-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Basic Info</span>
            <span>Pricing</span>
            <span>Images</span>
            <span>Models</span>
            <span>Details</span>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Back</span>
            </button>

            {currentStep < totalSteps ? (
              <motion.button
                onClick={nextStep}
                className="flex items-center space-x-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="hidden sm:inline">Next Step</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            ) : (
              <motion.button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-4 sm:px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                    <span className="hidden sm:inline">Publishing...</span>
                    <span className="sm:hidden">Publishing</span>
                  </>
                ) : (
                  <>
                    <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Publish Product</span>
                    <span className="sm:hidden">Publish</span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
