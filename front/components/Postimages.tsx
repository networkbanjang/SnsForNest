import PropTypes from 'prop-types';
import { useCallback, useState, useMemo } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { Card } from "antd";
import ImageZoom from './imagesZoom';
import backurl from '../config/config';


const PostImages = ({ images }) => {
  //스타일설정
  const style = useMemo(() => ({
    display: 'inline-block',
    width: '50%',
    textAlign: 'center',
  }), [])


  const [showImageZoom, setShowImageZoom] = useState(false);

  const onZoom = useCallback(() => {
    setShowImageZoom(true);
  }, []);

  const onClose = useCallback(() => {
    setShowImageZoom(false);
  }, [])

  if (images.length === 1) {
    return (
      <div>
        <img role="presentation" src={`${backurl}/${images[0].src}`} alt={images[0].src} onClick={onZoom} />
        {showImageZoom && <ImageZoom images={images} onClose={onClose} />}
      </div>
    );
  }
  if (images.length === 2) {
    return (
      <div>
        <img role="presentation" width="50%" src={`${backurl}/${images[0].src}`} alt={images[0].src} onClick={onZoom} />
        <img role="presentation" width="50%" src={`${backurl}/${images[1].src}`} alt={images[1].src} onClick={onZoom} />
        {showImageZoom && <ImageZoom images={images} onClose={onClose} />}

      </div>
    );
  }
  return (
    <div>
      <img role="presentation" width="50%" src={`${backurl}/${images[0].src}`} alt={images[0].src} onClick={onZoom} />
      <div role='presentation' style={style} onClick={onZoom}>
        <PlusOutlined />
        <br />
        더보기
      </div>
      {showImageZoom && <ImageZoom images={images} onClose={onClose} />}

    </div>
  )
};


PostImages.prototype = {
  images: PropTypes.arrayOf(PropTypes.object),
}
export default PostImages;