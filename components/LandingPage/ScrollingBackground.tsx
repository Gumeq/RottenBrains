import styles from "./ScrollingBackground.module.css";
import ScrollButton from "./ScrollButton";

const ScrollingBackground = () => {
	return (
		<div className="relative h-screen w-screen overflow-hidden bg-black">
			<div className="absolute top-0 left-0 w-full h-full flex flex-col">
				<div
					className={`${styles.imageContainer} ${styles.scrollRight}`}
				>
					<div className={styles.imageWrapper}>
						<div className="relative w-full h-full">
							<img
								src="/assets/images/bg-main (4).png"
								alt="Image 4"
								className="object-cover w-full h-full absolute top-0 left-0"
							/>
						</div>
					</div>
					<div className={styles.imageWrapper}>
						<div className="relative w-full h-full">
							<img
								src="/assets/images/bg-main (4).png"
								alt="Image 4"
								className="object-cover w-full h-full absolute top-0 left-0"
							/>
						</div>
					</div>
				</div>
				<div
					className={`${styles.imageContainer} ${styles.scrollLeft}`}
				>
					<div className={styles.imageWrapper}>
						<div className="relative w-full h-full">
							<img
								src="/assets/images/bg-main (4).png"
								alt="Image 4"
								className="object-cover w-full h-full absolute top-0 left-0"
							/>
						</div>
					</div>
					<div className={styles.imageWrapper}>
						<div className="relative w-full h-full">
							<img
								src="/assets/images/bg-main (4).png"
								alt="Image 4"
								className="object-cover w-full h-full absolute top-0 left-0"
							/>
						</div>
					</div>
				</div>
				<div
					className={`${styles.imageContainer} ${styles.scrollRight}`}
				>
					<div className={styles.imageWrapper}>
						<div className="relative w-full h-full">
							<img
								src="/assets/images/bg-main (4).png"
								alt="Image 4"
								className="object-cover w-full h-full absolute top-0 left-0"
							/>
						</div>
					</div>
					<div className={styles.imageWrapper}>
						<div className="relative w-full h-full">
							<img
								src="/assets/images/bg-main (4).png"
								alt="Image 4"
								className="object-cover w-full h-full absolute top-0 left-0"
							/>
						</div>
					</div>
				</div>
				<div
					className={`${styles.imageContainer} ${styles.scrollLeft}`}
				>
					<div className={styles.imageWrapper}>
						<div className="relative w-full h-full">
							<img
								src="/assets/images/bg-main (4).png"
								alt="Image 4"
								className="object-cover w-full h-full absolute top-0 left-0"
							/>
						</div>
					</div>
					<div className={styles.imageWrapper}>
						<div className="relative w-full h-full">
							<img
								src="/assets/images/bg-main (4).png"
								alt="Image 4"
								className="object-cover w-full h-full absolute top-0 left-0"
							/>
						</div>
					</div>
				</div>
			</div>
			{/* Dark overlay */}
			<div className="absolute inset-0 bg-black opacity-80"></div>

			{/* Radial blur overlay */}
			<div className={`${styles.radialBlurOverlay}`}></div>
			<div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-white px-4">
				<h1 className="text-4xl  sm:text-6xl font-bold pb-4">
					BingeBuddy
				</h1>
				<h2 className="text-xl sm:text-2xl text-center">
					Discover & Share Your Passion for Movies and TV
				</h2>
				<ScrollButton></ScrollButton>
			</div>
		</div>
	);
};

export default ScrollingBackground;

// ("/assets/images/bg-main (3).png");
