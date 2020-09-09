'use strict'
history.scrollRestoration = "manual";
let posY = 0;
let prevScrollHeight = 0;
let currentPage = 0;
let enterNewScene = false; // 새로운 page가 시작되는 순간 true;

const defaultSet = {
    body: document.querySelector("body"),
};
const pageInfo = [
    {
        //index 0 
        mode: "sticky",
        scrollHeight: 0,
        num: 5,
        objs: {
            container: document.querySelector(".section__0"),
            imgWrap: document.querySelector(".section__0 .imgs__wrap"),
            imgPosition: document.querySelector(".section__0 .imgs__position"),
            imgBlend: document.querySelector(".section__0 .imgs__blend"),
            leftBox: document.querySelector(".section__0 .box__left"),
            rightBox: document.querySelector(".section__0 .box__right"),
            typoA: document.querySelector(".section__0 .imgs__typo-0"),
            typoB: document.querySelector(".section__0 .imgs__typo-1"),
        },
        values: {
            move: [0, 0, { start: 0, end: 0 }],
            typoAin: [0, 1, { start: 0, end: 0 }],
            typoAout: [1, 0, { start: 0, end: 0 }],
            typoBin: [0, 1, { start: 0, end: 0 }],
            typoBout: [1, 0, { start: 0, end: 0 }],
            blend: [0, 0, { start: 0, end: 0 }],
            scale: [1, 0.7, { start: 0, end: 0 }]
        }
    },
    {
        // index1
        mode: "sticky",
        scrollHeight: 0,
        num: 5,
        objs: {
            container: document.querySelector(".section__1"),
            imgWrap: document.querySelector(".section__1 .imgs__wrap"),
            imgPosition: document.querySelector(".section__1 .imgs__position"),
            imgBlend: document.querySelector(".section__1 .imgs__blend"),
            leftBox: document.querySelector(".section__1 .box__left"),
            rightBox: document.querySelector(".section__1 .box__right"),
            typoA: document.querySelector(".section__1 .imgs__typo-0"),
            typoB: document.querySelector(".section__1 .imgs__typo-1"),
        }, values: {
            move: [0, 0, { start: 0, end: 0 }],
            typoAin: [0, 1, { start: 0, end: 0 }],
            typoAout: [1, 0, { start: 0, end: 0 }],
            typoBin: [0, 1, { start: 0, end: 0 }],
            typoBout: [1, 0, { start: 0, end: 0 }],
            blend: [0, 0, { start: 0, end: 0 }],
        }
    },
    {
        //index 2 
        mode: "sticky",
        scrollHeight: 0,
        num: 4,
        objs: {
            container: document.querySelector(".section__2"),
            imgWrap: document.querySelector(".section__2 .imgs__wrap"),
            imgPosition: document.querySelector(".section__2 .imgs__position"),
            imgBlend: document.querySelector(".section__2 .imgs__blend"),
            leftBox: document.querySelector(".section__2 .box__left"),
            rightBox: document.querySelector(".section__2 .box__right"),
            typoA: document.querySelector(".section__2 .imgs__typo-0"),
            typoB: document.querySelector(".section__2 .imgs__typo-1"),
            video: document.querySelector("video")
        },
        values: {
            move: [0, 0, { start: 0, end: 0 }],
            typoAin: [0, 1, { start: 0, end: 0 }],
            typoAout: [1, 0, { start: 0, end: 0 }],
            typoBin: [0, 1, { start: 0, end: 0 }],
            typoBout: [1, 0, { start: 0, end: 0 }],
            blend: [0, 0, { start: 0, end: 0 }],
            scale: [1, 0.7, { start: 0, end: 0 }],
            video: [0, 1, { start: 0, end: 0 }]
        }
    },

]

function setLayout() {
    const objs = pageInfo[currentPage].objs;
    const values = pageInfo[currentPage].values;
    const scrollHeight = pageInfo[currentPage].scrollHeight;

    // 각 섹션별 높이
    for (let i = 0; i < pageInfo.length; i++) {
        if (pageInfo[i].mode === "sticky") {
            pageInfo[i].scrollHeight = innerHeight * pageInfo[i].num;
        }
        else if (pageInfo[i].mode === "normal") {
            pageInfo[i].scrollHeight = pageInfo[i].objs.container.offsetHeight;
        }

        pageInfo[i].objs.container.style.height = `${pageInfo[i].scrollHeight}px`;
    }
}

function calcValues(values, currentYOffset) {
    let rv;
    // 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
    const scrollHeight = pageInfo[currentPage].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    if (values.length === 3) {
        // start ~ end 사이에 애니메이션 실행
        const partScrollStart = values[2].start * scrollHeight;
        const partScrollEnd = values[2].end * scrollHeight;
        const partScrollHeight = partScrollEnd - partScrollStart;

        if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
            rv =
                ((currentYOffset - partScrollStart) / partScrollHeight) *
                (values[1] - values[0]) +
                values[0];
        } else if (currentYOffset < partScrollStart) {
            rv = values[0];
        } else if (currentYOffset > partScrollEnd) {
            rv = values[1];
        }
    } else {
        rv = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return rv;
}

function animationPlay() {

    // 각 페이지에 따른 애니메이션
    const objs = pageInfo[currentPage].objs;
    const values = pageInfo[currentPage].values;
    let currentYOffset = posY - prevScrollHeight;
    let scrollHeight = pageInfo[currentPage].scrollHeight;
    let scrollRatio = currentYOffset / scrollHeight;

    switch (currentPage) {
        case 0:
            // 이미지 좌우 엘리먼트 박스 이동
            values.move[1] = objs.leftBox.clientWidth;
            values.move[2].end = pageInfo[currentPage].objs.imgWrap.offsetTop / pageInfo[currentPage].scrollHeight;
            let moveValue = calcValues(values.move, currentYOffset);
            objs.leftBox.style.transform = `translateX(-${moveValue}px)`;
            objs.rightBox.style.transform = `translateX(${moveValue}px)`;

            //position 변경
            if (scrollRatio < values.move[2].end) {
                objs.imgPosition.classList.remove("sticky");
            } else {
                objs.imgPosition.classList.add("sticky");
            }

            // typoA opacity
            values.typoAin[2].start = values.move[2].end;
            values.typoAin[2].end = values.typoAin[2].start + 0.025;
            values.typoAout[2].start = values.typoAin[2].end + 0.025;
            values.typoAout[2].end = values.typoAout[2].start + 0.025;

            let typoAin = calcValues(values.typoAin, currentYOffset);
            let typoAout = calcValues(values.typoAout, currentYOffset);
            if (scrollRatio >= values.typoAin[2].start) {
                objs.typoA.style.opacity = `${typoAin}`;
            } else {
                objs.typoA.style.opacity = `0`;
            }

            if (scrollRatio >= values.typoAout[2].start) {
                objs.typoA.style.opacity = `${typoAout}`;
            }

            // 블랜드효과
            values.blend[1] = objs.imgPosition.offsetHeight;
            values.blend[2].start = values.typoAout[2].end;
            values.blend[2].end = values.blend[2].start + 0.25;
            let blendValue = calcValues(values.blend, currentYOffset);
            objs.imgBlend.style.height = `${blendValue}px`;

            //typoB opacity
            values.typoBin[2].start = values.blend[2].end;
            values.typoBin[2].end = values.typoBin[2].start + 0.025;
            values.typoBout[2].start = values.typoBin[2].end + 0.025;
            values.typoBout[2].end = values.typoBout[2].start + 0.025;
            let typoBin = calcValues(values.typoBin, currentYOffset);
            let typoBout = calcValues(values.typoBout, currentYOffset);

            if (scrollRatio >= values.typoBin[2].start) {
                objs.typoB.style.opacity = `${typoBin}`;
            } else {
                objs.typoB.style.opacity = `0`;
            }

            if (scrollRatio >= values.typoBout[2].start) {
                objs.typoB.style.opacity = `${typoBout}`;
            }
            //스케일 효과
            values.scale[2].start = values.typoBout[2].end;
            values.scale[2].end = values.scale[2].start + 0.1;
            let scaleValue = calcValues(values.scale, currentYOffset);
            objs.imgPosition.style.transform = `scale(${scaleValue})`;
            if (scrollRatio > values.scale[2].end) {
                objs.imgPosition.classList.remove("sticky");
                objs.imgPosition.style.marginTop = `${scrollHeight * 0.5}px`;
                objs.imgBlend.classList.add("on");
            } else {
                objs.imgBlend.classList.remove("on");
                objs.imgPosition.style.marginTop = `0px`;
            }
            break;
        case 1:
            // 이미지 좌우 엘리먼트 박스 이동
            values.move[1] = objs.leftBox.clientWidth;
            values.move[2].end = pageInfo[currentPage].objs.imgWrap.offsetTop / pageInfo[currentPage].scrollHeight;
            let moveValue2 = calcValues(values.move, currentYOffset);
            objs.leftBox.style.transform = `translateX(-${moveValue2}px)`;
            objs.rightBox.style.transform = `translateX(${moveValue2}px)`;

            //position 변경
            if (scrollRatio < values.move[2].end) {
                objs.imgPosition.classList.remove("sticky");
            } else {
                objs.imgPosition.classList.add("sticky");
            }
            // typoA opacity
            values.typoAin[2].start = values.move[2].end;
            values.typoAin[2].end = values.typoAin[2].start + 0.025;
            values.typoAout[2].start = values.typoAin[2].end + 0.025;
            values.typoAout[2].end = values.typoAout[2].start + 0.025;

            let typoAin2 = calcValues(values.typoAin, currentYOffset);
            let typoAout2 = calcValues(values.typoAout, currentYOffset);
            if (scrollRatio >= values.typoAin[2].start) {
                objs.typoA.style.opacity = `${typoAin2}`;
            } else {
                objs.typoA.style.opacity = `0`;
            }

            if (scrollRatio >= values.typoAout[2].start) {
                objs.typoA.style.opacity = `${typoAout2}`;
            }

            // 블랜드효과
            values.blend[1] = objs.imgPosition.offsetWidth;
            values.blend[2].start = values.typoAout[2].end;
            values.blend[2].end = values.blend[2].start + 0.25;
            let blendValue2 = calcValues(values.blend, currentYOffset);
            objs.imgBlend.style.width = `${blendValue2}px`;

            //typoB opacity
            values.typoBin[2].start = values.blend[2].end;
            values.typoBin[2].end = values.typoBin[2].start + 0.025;
            values.typoBout[2].start = values.typoBin[2].end + 0.025;
            values.typoBout[2].end = values.typoBout[2].start + 0.025;
            let typoBin2 = calcValues(values.typoBin, currentYOffset);
            let typoBout2 = calcValues(values.typoBout, currentYOffset);

            if (scrollRatio >= values.typoBin[2].start) {
                objs.typoB.style.opacity = `${typoBin2}`;
            } else {
                objs.typoB.style.opacity = `0`;
            }

            if (scrollRatio >= values.typoBout[2].start) {
                objs.typoB.style.opacity = `${typoBout2}`;
            }

            if (scrollRatio > values.typoBout[2].end) {
                objs.imgPosition.classList.remove("sticky");
                objs.imgPosition.style.marginTop = `${scrollHeight * 0.4}px`;
                objs.imgBlend.classList.add("on");
            } else {
                objs.imgBlend.classList.remove("on");
                objs.imgPosition.style.marginTop = `0px`;
            }
            break;
        case 2:
            // 이미지 좌우 엘리먼트 박스 이동
            values.move[1] = objs.leftBox.clientWidth;
            values.move[2].end = pageInfo[currentPage].objs.imgWrap.offsetTop / pageInfo[currentPage].scrollHeight;
            let moveValue3 = calcValues(values.move, currentYOffset);
            objs.leftBox.style.transform = `translateX(-${moveValue3}px)`;
            objs.rightBox.style.transform = `translateX(${moveValue3}px)`;

            //position 변경
            if (scrollRatio < values.move[2].end) {
                objs.imgPosition.classList.remove("sticky");
            } else {
                objs.imgPosition.classList.add("sticky");
            }

            // typoA opacity
            values.typoAin[2].start = values.move[2].end;
            values.typoAin[2].end = values.typoAin[2].start + 0.025;
            values.typoAout[2].start = values.typoAin[2].end + 0.025;
            values.typoAout[2].end = values.typoAout[2].start + 0.025;

            let typoAin3 = calcValues(values.typoAin, currentYOffset);
            let typoAout3 = calcValues(values.typoAout, currentYOffset);
            if (scrollRatio >= values.typoAin[2].start) {
                objs.typoA.style.opacity = `${typoAin3}`;
            } else {
                objs.typoA.style.opacity = `0`;
            }

            if (scrollRatio >= values.typoAout[2].start) {
                objs.typoA.style.opacity = `${typoAout3}`;
            }

            //영상 opacity
            values.video[2].start = values.move[2].end;
            values.video[2].end = values.video[2].start + 0.025;
            let video = calcValues(values.video, currentYOffset);
            if (scrollRatio >= values.video[2].start) {
                objs.video.style.opacity = `${video}`;
            }

            // 블랜드효과
            values.blend[1] = objs.imgPosition.offsetHeight;
            values.blend[2].start = values.typoAout[2].end;
            values.blend[2].end = values.blend[2].start + 0.25;
            let blendValue3 = calcValues(values.blend, currentYOffset);
            objs.imgBlend.style.height = `${blendValue3}px`;

            //typoB opacity
            values.typoBin[2].start = values.blend[2].end;
            values.typoBin[2].end = values.typoBin[2].start + 0.025;
            values.typoBout[2].start = values.typoBin[2].end + 0.025;
            values.typoBout[2].end = values.typoBout[2].start + 0.025;
            let typoBin3 = calcValues(values.typoBin, currentYOffset);
            let typoBout3 = calcValues(values.typoBout, currentYOffset);

            if (scrollRatio >= values.typoBin[2].start) {
                objs.typoB.style.opacity = `${typoBin3}`;
            } else {
                objs.typoB.style.opacity = `0`;
            }

            if (scrollRatio >= values.typoBout[2].start) {
                objs.typoB.style.opacity = `${typoBout3}`;
            }
            //스케일 효과
            values.scale[2].start = values.typoBout[2].end;
            values.scale[2].end = values.scale[2].start + 0.1;
            let scaleValue3 = calcValues(values.scale, currentYOffset);
            objs.imgPosition.style.transform = `scale(${scaleValue3})`;
            if (scrollRatio > values.scale[2].end) {
                objs.imgPosition.classList.remove("sticky");
                objs.imgPosition.style.marginTop = `${scrollHeight * 0.5}px`;
                objs.imgBlend.classList.add("on");
            } else {
                objs.imgBlend.classList.remove("on");
                objs.imgPosition.style.marginTop = `0px`;
            }
            break;
    }
}

function scrollLoop() {
    enterNewScene = false;
    prevScrollHeight = 0;

    for (let i = 0; i < currentPage; i++) {
        prevScrollHeight += pageInfo[i].scrollHeight;
    }

    if (posY > pageInfo[currentPage].scrollHeight + prevScrollHeight) {
        enterNewScene = true;
        currentPage++;
    }
    if (posY < prevScrollHeight) {
        enterNewScene = true;
        if (currentPage === 0) return; // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
        currentPage--;
    }
    defaultSet.body.setAttribute("id", `section__${currentPage}`);

    if (enterNewScene) return;

    animationPlay();
}

addEventListener("load", () => {
    setLayout();

    addEventListener("resize", () => {
        setLayout();
    });

    addEventListener("scroll", () => {
        posY = pageYOffset;
        scrollLoop();
    });
});