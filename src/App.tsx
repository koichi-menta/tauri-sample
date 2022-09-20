import React, { useState, useEffect } from "react";
import "./App.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { desktopDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/dialog";

const App = () => {
  const [marshmallowIds, setMarshmallowIds] = useState<string[]>([]);
  const [currentMarshmallow, setCurrentMarshmallow] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [src, setSrc] = useState<string[]>([]);
  // const { resetTransform } = useTransformContext();
  const handleAdd = () => {
    if (text === "") return;
    setMarshmallowIds([...marshmallowIds, text]);
    setText("");
  };
  const handleZoomReset = (resetTransform: any) => {
    resetTransform();
  };
  const handleSetMarshmallow = (id: string) => {
    // handleZoomReset();
    // resetTransform();
    setCurrentMarshmallow(id);
  };

  const openDialog = async () => {
    await open({ multiple: true }).then((files) => {
      console.log(files);
      if (!files) return;
      const aaa = Array.isArray(files) ? files : [files];
      setSrc([...src, ...aaa]);
    });
  };

  // useEffect(() => {
  //   const fn = async () => {
  //     const desktopDirPath = await desktopDir();
  //     const new_url = convertFileSrc(await join(desktopDirPath, src));
  //     console.log("new_url", new_url);
  //   };
  //   fn();
  // }, [src]);

  return (
    <div className="app">
      <div className="leftColumn">
        <input
          type="text"
          onChange={(e) => setText(e.target.value)}
          data-testid="idInput"
          value={text}
        />
        <button onClick={handleAdd} data-testid="addButton">
          登録
        </button>
        <button onClick={openDialog}>Click to open dialog</button>
        {src.map((item) => (
          <img src={convertFileSrc(item)} alt="" />
        ))}
        <div className="marshmallowList">
          <ul>
            {marshmallowIds.map((item) => (
              <li>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="main">
        <div className="imgWrap">
          {currentMarshmallow && (
            <TransformWrapper>
              {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                <>
                  <div className="buttonControl">
                    <button onClick={() => zoomIn()} data-testid="zoomBtn">
                      拡大
                    </button>
                    <button onClick={() => zoomOut()}>縮小</button>
                    <button onClick={() => handleZoomReset(resetTransform)}>
                      リセット
                    </button>
                  </div>
                  <TransformComponent
                    wrapperClass="imageWrapper"
                    contentClass="imageContainer testTransform"
                  >
                    <img
                      className="marshmallowImage"
                      src={`https://media.marshmallow-qa.com/system/images/${currentMarshmallow}.png`}
                      alt=""
                      data-testid="marshmallowImage"
                    />
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          )}
        </div>
        <Swiper
          modules={[EffectCoverflow]}
          effect={"coverflow"}
          spaceBetween={50}
          slidesPerView={3}
          centeredSlides={true}
          coverflowEffect={{
            rotate: 0,
            slideShadows: false,
            depth: 200,
          }}
          // onSlideChange={() => console.log("slide change")}
          // onSwiper={(swiper) => console.log(swiper)}
        >
          {marshmallowIds.map((id) => (
            <SwiperSlide>
              <img
                src={`https://media.marshmallow-qa.com/system/images/${id}.png`}
                alt=""
                onClick={() => handleSetMarshmallow(id)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default App;
