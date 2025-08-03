const AspectRatioVideo = ({
  videoUrl,
  aspectRatio = "16/9", // Default aspect ratio
  title = "Embedded Video",
}) => {
  // Tailwind does not support dynamic aspect ratio classes like aspect-16/9 out of the box,
  // so you might want to handle this differently or add custom classes.
  // For now, assuming aspectRatio is a valid Tailwind aspect ratio class suffix.

  return (
    <div className={`aspect-${aspectRatio} overflow-hidden rounded-lg`}>
      <iframe
        src={videoUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
};

export default AspectRatioVideo;
