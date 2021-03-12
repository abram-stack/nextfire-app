// @desc component loader, has one props(boolean)
// show if true

export default function Loader({show}) {
  return show ? <div className="loader"></div> : null
}