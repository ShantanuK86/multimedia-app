import React, { useState, useEffect } from 'react';
import { data } from './data';
import { Header } from "./components/Header";
import { AudioPlayer } from './components/AudioPlayer';
import { DocumentViewer } from './components/DocumentViewer';
import { VideoPlayer } from './components/VideoPlayer';
import { ImageViewer } from './components/ImageViewer';
import '@fortawesome/fontawesome-free/css/all.css';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function App() {
  const [myFiles, setMyFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePath, setFilePath] = useState("/file-server/")
  const [showChartModal, setShowChartModal] = useState(false)
  //State for feature "Space Breakdown"
  const [showChartModalSpace, setShowChartModalSpace] = useState(false)
  //States for feature "Files Filtering"
  const [filterVideo, setFilterVideo] = useState(false)
  const [filterAudio, setFilterAudio] = useState(false)
  const [filterDocument, setFilterDocument] = useState(false)
  const [filterImage, setFilterImage] = useState(false)
  const [hoveredFile, setHoveredFile] = useState(null)
  const [starred, setStarred] = useState(false)
  const [starredList, setStarredList] = useState([])
  const [starredListId, setStarredListId] = useState([])

  useEffect(() => {
    setMyFiles(data)
  }, [])

  const getFileIcon = (fileType) => {
    // Map file types to icon classes
    const fileIcons = {
      video: 'fas fa-video',
      audio: 'fas fa-music',
      image: 'fas fa-image',
      document: 'fas fa-file',
    };

    // Return the icon class based on the file type
    return fileIcons[fileType] || 'fas fa-file'; // Default to a file icon if the type is not found
  };

  var barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Files Breakdown',
      },
    },
  };

  return (
    <>
      {showChartModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <p style={{ fontWeight: "bold" }}>Files Breakdown</p>
              <button style={styles.closeButton} onClick={() => setShowChartModal(false)}>close</button>
            </div>
            <div style={styles.modalBody}>
              <Pie
                data={{
                  labels: ['Video', 'Audio', 'Document', 'Image'],
                  datasets: [
                    {
                      label: 'Files Breakdown',
                      data: [myFiles.filter(file => file.type === 'video').length, myFiles.filter(file => file.type === 'audio').length, myFiles.filter(file => file.type === 'document').length, myFiles.filter(file => file.type === 'image').length],
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                      ],
                      borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
              />
              <Bar
                data={{
                  labels: ['Video', 'Audio', 'Document', 'Image'],
                  datasets: [
                    {
                      label: 'Files Breakdown',
                      data: [myFiles.filter(file => file.type === 'video').length, myFiles.filter(file => file.type === 'audio').length, myFiles.filter(file => file.type === 'document').length, myFiles.filter(file => file.type === 'image').length],
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                      ],
                      borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={barChartOptions}
              />
            </div>
          </div>
        </div>
      )}

      {/* Feature 1 : Adding new modal for space break down */}
      {showChartModalSpace && (
        <div style={styles.modal}>
          <div style={styles.modalContent2}>
            <div style={styles.modalHeader}>
              <p style={{ fontWeight: "bold" }}>Space Breakdown</p>
              <button style={styles.closeButton} onClick={() => setShowChartModalSpace(false)}>close</button>
            </div>
            <div style={styles.modalBody2}>
              {/* Total space to 1GB (example) */}
              <p>Total space : <span style={{ fontWeight: "bold" }}>1 GB</span></p>
              <p>
                {/* Compute space consumed */}
                Space consumed:<span style={{ fontWeight: "bold" }}>{" "}
                  {((
                    myFiles
                      .filter((file) => file.type === "video")
                      .reduce((totalSize, video) => totalSize + video.size, 0) +
                    myFiles
                      .filter((file) => file.type === "audio")
                      .reduce((totalSize, audio) => totalSize + audio.size, 0) +
                    myFiles
                      .filter((file) => file.type === "document")
                      .reduce((totalSize, document) => totalSize + document.size, 0) +
                    myFiles
                      .filter((file) => file.type === "image")
                      .reduce((totalSize, image) => totalSize + image.size, 0)) / 1000000).toFixed(2)}{" "}
                  GB</span>
              </p>
              {/* Display Pie Chart */}
              <Pie
                data={{
                  labels: ['Video', 'Audio', 'Document', 'Image', 'Free'],
                  datasets: [
                    {
                      label: 'Space Breakdown (in KB)',
                      data: [
                        myFiles.filter(file => file.type === 'video').reduce((totalSize, video) => totalSize + video.size, 0),
                        myFiles.filter(file => file.type === 'audio').reduce((totalSize, audio) => totalSize + audio.size, 0),
                        myFiles.filter(file => file.type === 'document').reduce((totalSize, document) => totalSize + document.size, 0),
                        myFiles.filter(file => file.type === 'image').reduce((totalSize, image) => totalSize + image.size, 0),
                        1000000 - (myFiles.filter(file => file.type === 'video').reduce((totalSize, video) => totalSize + video.size, 0)
                          + myFiles.filter(file => file.type === 'audio').reduce((totalSize, audio) => totalSize + audio.size, 0)
                          + myFiles.filter(file => file.type === 'document').reduce((totalSize, document) => totalSize + document.size, 0),
                          + myFiles.filter(file => file.type === 'image').reduce((totalSize, image) => totalSize + image.size, 0))
                      ],
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 163, 164, 0.2)',
                      ],
                      borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 163, 164, 1)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            </div>
          </div>
        </div >
      )
      }



      <div className="App">
        <Header />
        <div style={styles.container}>
          <div style={{ padding: 10, paddingBottom: 0, }}>
            <p style={{ fontWeight: "bold" }}>My Files</p>
            <p>{selectedFile ? selectedFile.path : filePath}</p>
          </div>

          <div style={styles.controlTools}>

            <button style={styles.controlButton}
              onClick={() => {
                if (selectedFile) {
                  const newFiles = myFiles.map(file => {
                    if (file.id === selectedFile.id) {
                      return {
                        ...file,
                        name: prompt("Enter new name")
                      }
                    }
                    return file
                  })
                  setMyFiles(newFiles)
                  setSelectedFile(null)
                }
              }}
            >Rename</button>

            <button style={styles.controlButton}
              onClick={() => {
                setShowChartModal(true)
              }}
            >Files Breakdown</button>

            {/* New Button to trigger Space breakdown modal */}
            <button style={styles.controlButton}
              onClick={() => {
                setShowChartModalSpace(true)
              }}
            >Space Breakdown</button>

            <button style={styles.controlButton}
              onClick={() => {
                if (selectedFile) {
                  window.open(selectedFile.path, "_blank")
                }
              }}
            >Download</button>

            <button style={styles.controlButton}
              onClick={() => {
                if (selectedFile) {
                  const newFiles = myFiles.filter(file => file.id !== selectedFile.id);
                  setMyFiles(newFiles);
                  setSelectedFile(null);
                }
              }}
            >Delete</button>

          </div>

          {/* Feature 2 : Adding filters */}
          <div style={{ padding: 10, paddingBottom: 0, }}>
            <p>Filters</p>
          </div>

          <div style={styles.controlTools}>

            {/* Filter - Video button  */}
            <button style={{ ...styles.filterButton, backgroundColor: filterVideo ? 'blue' : 'black', }}
              onClick={() => {
                let onlyVideo = [];
                let onlyAudio = [];
                let onlyDocument = [];
                let onlyImage = [];

                //Disabling current filter
                if (filterVideo) {
                  onlyVideo = [];
                  setFilterVideo(false)
                  //Showing all files if no others filters
                  if (!filterAudio && !filterDocument && !filterImage && !starred) {
                    return setMyFiles(data)
                  }
                  //Showing favorite files 
                  if (!filterAudio && !filterDocument && !filterImage && starred) {
                    return setMyFiles(starredList)
                  }
                } else { onlyVideo = data.filter(file => file.type === "video"); setFilterVideo(true) }

                //Capturing  other filters statuses
                if (filterAudio) {
                  onlyAudio = data.filter(file => file.type === "audio");
                } else { onlyAudio = [] }

                if (filterDocument) {
                  onlyDocument = data.filter(file => file.type === "document");
                } else { onlyDocument = [] }

                if (filterImage) {
                  onlyImage = data.filter(file => file.type === "image");
                } else { onlyImage = [] }

                //Applying favorite filter
                setSelectedFile(null)
                if (starred) {
                  onlyVideo = onlyVideo.filter(item => starredList.includes(item));
                  onlyDocument = onlyDocument.filter(item => starredList.includes(item));
                  onlyImage = onlyImage.filter(item => starredList.includes(item));
                  onlyAudio = onlyAudio.filter(item => starredList.includes(item));
                  return setMyFiles([...onlyVideo, ...onlyAudio, ...onlyDocument, ...onlyImage])
                } else {
                  return setMyFiles([...onlyVideo, ...onlyAudio, ...onlyDocument, ...onlyImage])
                }

              }}
            ><i style={styles.iconButton} className="fas fa-video"></i></button>

            {/* Filter - Audio button  */}
            <button style={{ ...styles.filterButton, backgroundColor: filterAudio ? 'blue' : 'black', }}
              onClick={() => {
                let onlyVideo = [];
                let onlyAudio = [];
                let onlyDocument = [];
                let onlyImage = [];

                if (filterVideo) {
                  onlyVideo = data.filter(file => file.type === "video");
                } else { onlyVideo = []; }

                //Disabling current filter
                if (filterAudio) {
                  onlyAudio = [];
                  setFilterAudio(false)
                  if (!filterVideo && !filterDocument && !filterImage && !starred) {
                    return setMyFiles(data)
                  }
                  if (!filterVideo && !filterDocument && !filterImage && starred) {
                    return setMyFiles(starredList)
                  }

                } else { onlyAudio = data.filter(file => file.type === "audio"); setFilterAudio(true) }

                if (filterDocument) {
                  onlyDocument = data.filter(file => file.type === "document");
                } else { onlyDocument = [] }

                if (filterImage) {
                  onlyImage = data.filter(file => file.type === "image");
                } else { onlyImage = [] }

                //Applying favorite filter
                setSelectedFile(null)
                if (starred) {
                  onlyVideo = onlyVideo.filter(item => starredList.includes(item));
                  onlyDocument = onlyDocument.filter(item => starredList.includes(item));
                  onlyImage = onlyImage.filter(item => starredList.includes(item));
                  onlyAudio = onlyAudio.filter(item => starredList.includes(item));
                  return setMyFiles([...onlyVideo, ...onlyAudio, ...onlyDocument, ...onlyImage])
                } else {
                  return setMyFiles([...onlyVideo, ...onlyAudio, ...onlyDocument, ...onlyImage])
                }

              }}
            ><i style={styles.iconButton} className="fas fa-music"></i></button>

            {/* Filter - Document button  */}
            <button style={{ ...styles.filterButton, backgroundColor: filterDocument ? 'blue' : 'black', }}
              onClick={() => {
                let onlyVideo = [];
                let onlyAudio = [];
                let onlyDocument = [];
                let onlyImage = [];

                if (filterVideo) {
                  onlyVideo = data.filter(file => file.type === "video");
                } else { onlyVideo = []; }

                if (filterAudio) {
                  onlyAudio = data.filter(file => file.type === "audio");
                } else { onlyAudio = []; }

                //Disabling current filter
                if (filterDocument) {
                  onlyDocument = [];
                  setFilterDocument(false)
                  if (!filterVideo && !filterAudio && !filterImage && !starred) {
                    return setMyFiles(data)
                  }
                  if (!filterVideo && !filterAudio && !filterImage && starred) {
                    return setMyFiles(starredList)
                  }
                } else { onlyDocument = data.filter(file => file.type === "document"); setFilterDocument(true) }

                if (filterImage) {
                  onlyImage = data.filter(file => file.type === "image");
                } else { onlyImage = [] }

                //Applying favorite filter
                setSelectedFile(null)
                if (starred) {
                  onlyVideo = onlyVideo.filter(item => starredList.includes(item));
                  onlyDocument = onlyDocument.filter(item => starredList.includes(item));
                  onlyImage = onlyImage.filter(item => starredList.includes(item));
                  onlyAudio = onlyAudio.filter(item => starredList.includes(item));
                  return setMyFiles([...onlyVideo, ...onlyAudio, ...onlyDocument, ...onlyImage])
                } else {
                  return setMyFiles([...onlyVideo, ...onlyAudio, ...onlyDocument, ...onlyImage])
                }
              }}
            ><i style={styles.iconButton} className="fas fa-file"></i></button>

            {/* Filter - Image button */}
            <button style={{ ...styles.filterButton, backgroundColor: filterImage ? 'blue' : 'black', }}
              onClick={() => {
                let onlyVideo = [];
                let onlyAudio = [];
                let onlyDocument = [];
                let onlyImage = [];

                if (filterVideo) {
                  onlyVideo = data.filter(file => file.type === "video");
                } else { onlyVideo = [] }

                if (filterAudio) {
                  onlyAudio = data.filter(file => file.type === "audio");
                } else { onlyAudio = [] }

                if (filterDocument) {
                  onlyDocument = data.filter(file => file.type === "document");
                } else { onlyDocument = [] }

                //Disabling current filter
                if (filterImage) {
                  onlyImage = [];
                  setFilterImage(false);
                  if (!filterVideo && !filterAudio && !filterDocument && !starred) {
                    return setMyFiles(data)
                  }
                  if (!filterVideo && !filterAudio && !filterDocument && starred) {
                    return setMyFiles(starredList)
                  }
                } else {
                  onlyImage = data.filter(file => file.type === "image"); setFilterImage(true)
                }

                //Applying favorite filter
                setSelectedFile(null)
                if (starred) {
                  onlyVideo = onlyVideo.filter(item => starredList.includes(item));
                  onlyDocument = onlyDocument.filter(item => starredList.includes(item));
                  onlyImage = onlyImage.filter(item => starredList.includes(item));
                  onlyAudio = onlyAudio.filter(item => starredList.includes(item));
                  return setMyFiles([...onlyVideo, ...onlyAudio, ...onlyDocument, ...onlyImage])
                } else {
                  return setMyFiles([...onlyVideo, ...onlyAudio, ...onlyDocument, ...onlyImage])
                }

              }}
            ><i style={styles.iconButton} className="fas fa-image"></i></button>

            {/* Filter - Favorite button (disabled if no starred files) */}
            <button style={{
              ...styles.filterButton,
              backgroundColor: starred && starredList.length !== 0 ? 'blue' : starredList.length === 0 ? 'grey' : 'black',
            }}
              disabled={starredList.length === 0}
              onClick={() => {


                let onlyVideo = [];
                let onlyAudio = [];
                let onlyDocument = [];
                let onlyImage = [];

                if (starred) {

                  if (!filterVideo && !filterAudio && !filterDocument && !filterImage) {
                    setStarred(false);
                    return setMyFiles(data)
                  }

                  if (filterVideo) {
                    onlyVideo = data.filter(file => file.type === "video");
                  } else { onlyVideo = [] }

                  if (filterAudio) {
                    onlyAudio = data.filter(file => file.type === "audio");
                  } else { onlyAudio = [] }

                  if (filterDocument) {
                    onlyDocument = data.filter(file => file.type === "document");
                  } else { onlyDocument = [] }

                  if (filterImage) {
                    onlyImage = data.filter(file => file.type === "image");
                  } else { onlyImage = []; }

                  setStarred(false);
                  setSelectedFile(null)
                  return setMyFiles([...onlyVideo, ...onlyAudio, ...onlyDocument, ...onlyImage])

                } else {

                  if (!filterVideo && !filterAudio && !filterDocument && !filterImage) {
                    setStarred(true);
                    return setMyFiles(starredList)
                  }

                  if (filterVideo) {
                    onlyVideo = data.filter(file => file.type === "video").filter(item => starredList.includes(item));
                  } else { onlyVideo = [] }

                  if (filterAudio) {
                    onlyAudio = data.filter(file => file.type === "audio").filter(item => starredList.includes(item));
                  } else { onlyAudio = [] }

                  if (filterDocument) {
                    onlyDocument = data.filter(file => file.type === "document").filter(item => starredList.includes(item));
                  } else { onlyDocument = [] }

                  if (filterImage) {
                    onlyImage = data.filter(file => file.type === "image").filter(item => starredList.includes(item));
                  } else { onlyImage = []; }

                  setStarred(true);
                  setSelectedFile(null);
                  return setMyFiles([...onlyVideo, ...onlyAudio, ...onlyDocument, ...onlyImage])

                }

              }}

            ><i style={styles.iconButton} className="fas fa-star"></i></button>

            {/* Filter - Reset filters */}
            <button style={styles.filterButton}
              onClick={() => {
                setMyFiles(data)
                setFilterVideo(false)
                setFilterAudio(false)
                setFilterDocument(false)
                setFilterImage(false)
                setSelectedFile(null)
                setStarred(false);
              }}
            ><i style={styles.iconButton} className="fas fa-undo" ></i></button>

          </div>


          {/* Files list */}

          <div style={styles.fileContainer}>
            <div style={{ width: "100%", padding: 10 }}>
              {myFiles.map((file) => {

                if (file.path.slice(0, filePath.length) === filePath) {

                  return (
                    <div style={{ ...styles.file, ...(hoveredFile && hoveredFile.id === file.id ? styles.fileHovered : {}), ...(selectedFile && selectedFile.id === file.id ? styles.fileSelected : {}) }}
                      className="files"
                      key={file.id}
                      onMouseEnter={() => setHoveredFile(file)} onMouseLeave={() => setHoveredFile(null)}
                      onClick={() => {
                        if (selectedFile && selectedFile.id === file.id) {
                          setSelectedFile(null)
                        } else { setSelectedFile(file) }
                      }}>
                      <p>

                        {/* Clickable star icon to enable user to add file to favorite */}
                        <i className="fas fa-star"
                          style={{ ...styles.icon, color: starredList.some(item => item.id === file.id) ? 'blue' : 'black', }}
                          onClick={() => {

                            let updatedList = [];
                            if (starredList.some(item => item.id === file.id)) {
                              updatedList = starredList.filter(item => item.id !== file.id);
                            } else {
                              updatedList = [...starredList, file];
                            }
                            setStarred(false);
                            return setStarredList(updatedList)
                          }}>
                        </i>
                        {/* File type icon */}
                        <i style={styles.icon} className={getFileIcon(file.type)}></i>
                        {file.name}
                      </p>
                    </div>

                  )
                }

              })}

            </div>

            {selectedFile && (
              <div style={styles.fileViewer}>
                {selectedFile.type === 'video' && (
                  <VideoPlayer path={selectedFile.path} />
                )}
                {selectedFile.type === 'audio' && (
                  <AudioPlayer path={selectedFile.path} />
                )}
                {selectedFile.type === 'document' && (
                  <DocumentViewer path={selectedFile.path} />
                )}
                {selectedFile.type === 'image' && (
                  <ImageViewer path={selectedFile.path} />
                )}
                <p style={{ fontWeight: "bold", marginTop: 10 }}>{selectedFile.name}</p>
                <p>path: <span style={{ fontStyle: "italic" }}>{selectedFile.path}</span></p>
                <p>file type: <span style={{ fontStyle: "italic" }}>{selectedFile.type}</span></p>
                {/* File size display */}
                <p>file size: <span style={{ fontStyle: "italic" }}>{selectedFile.size} KB</span></p>
              </div>

            )}
          </div>
        </div>
      </div >
    </>
  );
}

const styles = {
  container: {
    backgroundColor: '#fff',
    color: '#000',
  },
  fileContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',

  },
  file: {
    backgroundColor: '#eee',
    padding: '10px',
    marginBottom: '10px',
    cursor: 'pointer',
    width: '100%',
  },
  fileHovered: {
    backgroundColor: '#99A3A4',
  },
  fileSelected: {
    backgroundColor: '#99A3A4',
  },
  fileViewer: {
    padding: '10px',
    margin: '10px',
    width: '30vw',
    height: '100vh',
    cursor: 'pointer',
    borderLeft: '1px solid #000'
  },
  controlTools: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexDirection: 'row',
    padding: '10px',
  },
  controlButton: {
    padding: '10px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  filterButton: {
    padding: '5px 25px',
    marging: 'auto',
    border: 'none',
    borderRadius: '15px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: 'white',
    background: '#566573',
  },
  icon: {
    padding: '5px 25px',
    marging: 'auto',
  },
  iconButton: {
    padding: '8px 15px',
    marging: 'auto',
  },

  // modal
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    height: '50vh',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
  },
  modalContent2: {
    backgroundColor: '#fff',
    padding: '20px',
    height: '52vh',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
  },
  modalClose: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '10px',
    cursor: 'pointer',
  },
  modalBody: {
    width: '100%',
    height: '90%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: '10px',
  },
  modalBody2: {
    width: '100%',
    height: '90%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '10px',
  },
  modalHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  closeButton: {
    padding: '10px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: '#eee',
  }
};