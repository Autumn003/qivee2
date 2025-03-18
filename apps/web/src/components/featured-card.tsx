interface featuredCardProps {
  title: string;
  imageURL: string;
  price: number;
}

const FeaturedCard = ({ title, imageURL, price }: featuredCardProps) => {
  return (
    <div className="group">
      <div className="relative mb-4 rounded-lg overflow-hidden">
        <img
          src={imageURL}
          alt={title}
          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-4 right-4 bg-white/30 text-white backdrop-blur-2xl h-10 w-10 rounded-full opacity-0 group-hover:opacity-100  hover:text-red-500 cursor-pointer hover:bg-red-400/30 transition-all duration-200">
          <i className="ri-poker-hearts-line text-xl"></i>
        </button>
      </div>
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-secondary-foreground">${price}</p>
    </div>
  );
};

export default FeaturedCard;
