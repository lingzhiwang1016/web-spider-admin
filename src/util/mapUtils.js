/**
 * Created by vyouyou on 18-1-9.
 */
export const getPointSvg = (index) => {
    return `/local_${(index + "").length === 1 ? "0" : ""}${index}.svg`;
};

export const getLabelStyle = function () {
    return {
        color: "#000000",
        fontSize: "10px",
        fontFamily: "微软雅黑",
        backgroundColor: "transparent",
        borderWidth: "0px"
    };
};
