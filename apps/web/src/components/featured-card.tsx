interface featuredCardProps {
  title: string;
  imageURL: string;
  price: number;
}

const FeaturedCard = ({ title, imageURL, price }: featuredCardProps) => {
  return (
    <div className="group min-h-64 rounded-xl border border-muted-foreground overflow-hidden hover:border-primary-foreground/50 transition-colors duration-150">
      <div className="relative">
        <img
          src={imageURL}
          alt={title}
          className="w-full h-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-4 right-4 bg-white/30 text-white backdrop-blur-2xl h-10 w-10 rounded-full opacity-0 group-hover:opacity-100  hover:text-red-500 cursor-pointer hover:bg-red-400/30 transition-all duration-200">
          <i className="ri-poker-hearts-line text-xl"></i>
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-medium mb-2">{title}</h3>
        <p className="text-secondary-foreground">₹{price}</p>
      </div>
    </div>
  );
};

export default FeaturedCard;
