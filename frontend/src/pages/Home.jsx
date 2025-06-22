import React, { useEffect, useState, version } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { api_base_url } from "../helper";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isCreateModelShow, setIsCreateModelShow] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const [isEditModelShow, setisEditModelShow] = useState(false);

  const navigate = useNavigate();

  const [name, setName] = useState("");

  const onLanguageSelect = (selectedOption) => {
    setSelectedLanguage(selectedOption);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#000",
      borderColor: "#555",
      color: "#fff",
      padding: "5px",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#000",
      color: "#fff",
      width: "100%",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#333" : "#000",
      color: "#fff",
      cursor: "pointer",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#fff",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#aaa",
    }),
    input: (provided) => ({
      ...provided,
      color: "#fff",
    }),
  };

  const getRunTimes = async () => {
    let res = await fetch("https://emkc.org/api/v2/piston/runtimes");
    let data = await res.json();

    const filteredLanguages = [
      "python",
      "javascript",
      "c",
      "c++",
      "java",
      "bash",
    ];

    const options = data
      .filter((runtime) => filteredLanguages.includes(runtime.language))
      .map((runtime) => ({
        label: `${runtime.language} (${runtime.version})`,
        value: runtime.language === "c++" ? "cpp" : runtime.language,
        version: runtime.version,
      }));

    setOptions(options);
  };

  const handleLanguageChange = (selectedOption) => {
    setSelectedLanguage(selectedOption); // Update selected language state
    console.log("Selected language:", selectedOption);
  };

  const [projects, setProjects] = useState(null);

  const getProjects = async () => {
    fetch(api_base_url + "/getProjects", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setProjects(data.projects);
        } else {
          toast.error(data.msg);
        }
      });
  };

  useEffect(() => {
    getProjects();
    getRunTimes();
  }, []);

  const createProj = () => {
    fetch(api_base_url + "/createProj", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        projLanguage: selectedLanguage.value,
        token: localStorage.getItem("token"),
        version: selectedLanguage.version,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setName("");
          navigate("/editior/" + data.projectId);
        } else {
          toast.error(data.msg);
        }
      });
  };

  const deleteProject = (id) => {
    let conf = confirm("Are you sure you want to delete this project?");
    if (conf) {
      fetch(api_base_url + "/deleteProject", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: id,
          token: localStorage.getItem("token"),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            getProjects();
          } else {
            toast.error(data.msg);
          }
        });
    }
  };

  const [editprojId, setEditprojId] = useState("");

  const updateProj = () => {
    fetch(api_base_url+"/editProject",{
      mode:"cors",
      method:"POST",
      headers:{
        "Content-type":"application/json"
      },
      body: JSON.stringify({
        projectId:editprojId,
        token:localStorage.getItem("token"),
        name:name
      })
    }).then(res=>res.json()).then(data=>{
      if(data.success){
        setisEditModelShow(false);
        setName("");
        setEditprojId("");
        getProjects();
      }
      else{
        toast.error(data.msg);
        setisEditModelShow(false);
        setName("");
        setEditprojId("");
        getProjects();
      }
    })
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center px-[100px] justify-between mt-5">
        <h3 className="text-2xl">Hi 👋, DJ</h3>
        <div className="flex items-center">
          <button
            onClick={() => setIsCreateModelShow(true)}
            className="btnNormal bg-blue-500 transition-all hover:bg-blue-600"
          >
            Create Project
          </button>
        </div>
      </div>

      <div className="projects px-[100px] mt-5 pb-10">
        {projects && projects.length > 0
          ? projects.map((project, index) => {
              return (
                <>
                  <div className="project w-full p-[15px] flex items-center justify-between bg-[#0f0e0e] mb-4">
                    <div
                      onClick={() => {
                        navigate("/editior/" + project._id);
                      }}
                      className="flex width-full items-center gap-[15px]"
                    >
                      {project.projLanguage === "python" ? (
                        <>
                          <img
                            className="w-[130px] h-[100px] object-cover"
                            src="https://images.ctfassets.net/em6l9zw4tzag/oVfiswjNH7DuCb7qGEBPK/b391db3a1d0d3290b96ce7f6aacb32b0/python.png"
                            alt=""
                          />
                        </>
                      ) : project.projLanguage === "javascript" ? (
                        <>
                          <img
                            className="w-[130px] h-[100px] object-cover"
                            src="https://logodownload.org/wp-content/uploads/2022/04/javascript-logo-0.png"
                            alt=""
                          />
                        </>
                      ) : project.projLanguage === "cpp" ? (
                        <>
                          <img
                            className="w-[130px] h-[100px] object-cover"
                            src="https://upload.wikimedia.org/wikipedia/commons/3/32/C%2B%2B_logo.png"
                            alt=""
                          />
                        </>
                      ) : project.projLanguage === "c" ? (
                        <>
                          <img
                            className="w-[130px] h-[100px] object-cover"
                            src="https://upload.wikimedia.org/wikipedia/commons/1/19/C_Logo.png"
                            alt=""
                          />
                        </>
                      ) : project.projLanguage === "java" ? (
                        <>
                          <img
                            className="w-[130px] h-[100px] object-cover"
                            src="https://static.vecteezy.com/system/resources/thumbnails/022/101/050/small/java-logo-transparent-free-png.png"
                            alt=""
                          />
                        </>
                      ) : project.projLanguage === "bash" ? (
                        <>
                          <img
                            className="w-[130px] h-[100px] object-cover"
                            src="https://w7.pngwing.com/pngs/48/567/png-transparent-bash-shell-script-command-line-interface-z-shell-shell-rectangle-logo-commandline-interface-thumbnail.png"
                            alt=""
                          />
                        </>
                      ) : (
                        ""
                      )}

                      <div>
                        <h3 className="text-xl">{project.name}</h3>
                        <p className="text-[14px] text-[gray]">{new Date(project.date).toDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-[15px]">
                      <button onClick={()=>{
                        setisEditModelShow(true)
                        setEditprojId(project._id)
                        setName(project.name)
                      }} className="btnNormal bg-blue-500 transition-all hover:bg-blue-600">
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          deleteProject(project._id);
                        }}
                        className="btnNormal bg-red-500 transition-all hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              );
            })
          : "No Project found !"}
      </div>

      {isCreateModelShow && (
        <div
          onClick={(e) => {
            if (e.target.classList.contains("modelCon")) {
              setIsCreateModelShow(false);
              setName("");
            }
          }}
          className="modelCon flex flex-col items-center justify-center w-screen h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.5)]"
        >
          <div className="modelBox flex flex-col items-start gap-[15px] rounded-xl p-[20px] w-[25vw] bg-[#0F0E0E]">
            <h3 className="text-xl font-bold text-center w-full">
              Create Project
            </h3>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full p-2 rounded bg-[#1e1e1e] text-white border border-gray-600"
              type="text"
              placeholder="Enter your project name"
            />
            <Select
              placeholder="Select a Language"
              options={options}
              styles={customStyles}
              value={selectedLanguage}
              onChange={onLanguageSelect}
            />
            {selectedLanguage && (
              <>
                <div className="text-white text-sm mt-2">
                  Selected: <strong>{selectedLanguage.label}</strong> — Version:{" "}
                  {selectedLanguage.version}
                </div>
                <button
                  onClick={createProj}
                  className="btnNormal bg-blue-500 transition-all hover:bg-blue-700 mt-2"
                >
                  Create
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {isEditModelShow && (
        <div
          onClick={(e) => {
            if (e.target.classList.contains("modelCon")) {
              setisEditModelShow(false);
              setName("");
            }
          }}
          className="modelCon flex flex-col items-center justify-center w-screen h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.5)]"
        >
          <div className="modelBox flex flex-col items-start gap-[15px] rounded-xl p-[20px] w-[25vw] bg-[#0F0E0E]">
            <h3 className="text-xl font-bold text-center w-full">Update Project</h3>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full p-2 rounded bg-[#1e1e1e] text-white border border-gray-600"
              type="text"
              placeholder="Enter your project name"
            />

            <button
              onClick={updateProj}
              className="btnNormal bg-blue-500 transition-all hover:bg-blue-700 mt-2"
            >
              Update
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
