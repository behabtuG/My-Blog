import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

export default function UpdateProject() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateError, setUpdateError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/project/getproject/${projectId}`,
          { credentials: "include" }
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Error fetching project");
        }
        const data = await res.json();
        setFormData(data);
      } catch (error) {
        setUpdateError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  // Handle image upload
  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateError(null);
    setSubmitting(true);

    // Validate required fields
    if (!formData.title || !formData.description) {
      setUpdateError("Title and description are required.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/project/updateproject/${projectId}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update project");
      }

      const data = await res.json();
      navigate(`/projects`);
    } catch (error) {
      setUpdateError(error.message || "Something went wrong during update.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (updateError) {
    return (
      <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <Alert color="failure">{updateError}</Alert>
      </div>
    );
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Update Project
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Title"
          required
          id="title"
          className="flex-1"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          value={formData.title || ""}
        />
        <Select
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          value={formData.category || "uncategorized"}
        >
          <option value="uncategorized">Select a category</option>
          <option value="frontend">Project</option>
          <option value="backend">Course</option>
        </Select>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => {
              setFile(e.target.files[0]);
              handleUploadImage(); // Automatically trigger upload
            }}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          value={formData.description || ""}
          placeholder="Write project description..."
          className="h-72 mb-12"
          required
          onChange={(value) => setFormData({ ...formData, description: value })}
        />
        <TextInput
          type="text"
          placeholder="Demo Link"
          id="demoLink"
          className="flex-1"
          onChange={(e) =>
            setFormData({ ...formData, demoLink: e.target.value })
          }
          value={formData.demoLink || ""}
        />
        <TextInput
          type="text"
          placeholder="Source Code Link"
          id="sourceCodeLink"
          className="flex-1"
          onChange={(e) =>
            setFormData({ ...formData, sourceCodeLink: e.target.value })
          }
          value={formData.sourceCodeLink || ""}
        />
        <TextInput
          type="text"
          placeholder="Purchase Link"
          id="purchaseLink"
          className="flex-1"
          onChange={(e) =>
            setFormData({ ...formData, purchaseLink: e.target.value })
          }
          value={formData.purchaseLink || ""}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToPink"
          disabled={submitting || imageUploadProgress}
        >
          {submitting ? "Updating..." : "Update Project"}
        </Button>
        {updateError && (
          <Alert className="mt-5" color="failure">
            {updateError}
          </Alert>
        )}
      </form>
    </div>
  );
}
