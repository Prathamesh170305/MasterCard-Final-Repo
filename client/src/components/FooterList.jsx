export default function FooterList({ heading, list }) {
	return (
		<div>
			<h4 className="text-lg font-semibold mb-2">{heading}</h4>
			<ul className="space-y-1 text-gray-600">
				{list.map((element, index) => (
					<li key={index}>{element}</li>
				))}
			</ul>
		</div>
	);
}