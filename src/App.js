import React from 'react';
import Loader from 'react-loader-spinner';
import Masonry from './Masonry';
import ScrollButton from './ScrollButton';
import './App.scss';
import { key } from './key.json';

const API = `https://pixabay.com/api/?key=${key}&q=animals&image_type=photo&per_page=50`;

export default class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      images: [],
      breakPoints: [350, 500, 750],
      initialLoad: true,
      loadmore: false,
      page: 1
    };
    this.handleOnScroll = this.handleOnScroll.bind(this);
    this.fetchImages = this.fetchImages.bind(this);
  }

  async componentDidMount() {
    const res = await fetch(`${API}&page=${this.state.page}`);
    const images = await res.json();
    this.setState({
      images: images.hits,
      initialLoad: !this.state.initialLoad
    });
    window.addEventListener('scroll', this.handleOnScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleOnScroll);
  }

  async fetchImages() {
    this.setState({ loadmore: true });
    const res = await fetch(`${API}&page=${this.state.page + 1}`);
    const images = await res.json();
    this.setState({
      images: [...this.state.images, ...images.hits],
      loadmore: !this.state.loadmore,
      page: this.state.page + 1
    });
  }

  handleOnScroll() {
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;
    const scrolledToBottom = Math.ceil(scrollTop + clientHeight) === scrollHeight;

    if (scrolledToBottom) {
      this.fetchImages();
    }
  }

	render(){
    const { images, breakPoints, initialLoad, loadmore } = this.state;
		return (
			<div className="container">
				<div className="masonry-container">
          <p>ReactJS Responsive Grid By Gabriel Micah</p>
          {/* While the page is loading we want to display a loader else we 
            * we show our images
            */}
          {initialLoad ? <MyLoader width="100" height="100" /> :
          <React.Fragment>
            <Masonry breakPoints={breakPoints}>
              {images.map((image, id) => (
                <Tile key={id} src={image.webformatURL} alt={image.user} />
              ))}
            </Masonry>
            {/* When we get to the bottom of the page we want to show a loader
              * 
            */}
            {loadmore && <MyLoader width="50" height="50" />}
          </React.Fragment>}

          {/**
            * Scroll to top button
            */}
          <ScrollButton scrollStepInPx="50" delayInMs="16.66" />
				</div>
			</div>
		)
	}
}

const Tile = ({ src, alt }) => (
  <div className="tile">
    <img alt={alt} src={src} />
  </div>
);

const MyLoader = ({ width, height }) => (
  <div className="loading">
    <Loader
      type="ThreeDots"
      color="#00BFFF"
      height={height}
      width={width}
    />
  </div>
);
