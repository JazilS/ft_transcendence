import { CropperRef, Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css'
import {useState} from 'react';

interface CropDemoProps {
  src: string;
}

export default function CropDemo({ src }: { src: string }) {

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    console.log(croppedArea, croppedAreaPixels)
  }

console.log()

const defaultSrc =
  "https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg";
  const [image] = useState(
    'https://images.unsplash.com/photo-1599140849279-1014532882fe?fit=crop&w=1300&q=80',
);}
