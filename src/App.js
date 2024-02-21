import React, { useState, useEffect } from 'react';
import './App.css';

let messages = [];

function App() {
	const [uiState, setUiState] = useState([]);
	const [selectedOptions, setSelectedOptions] = useState([]);

	useEffect(() => {
		const promptsJson = [
			{
				role: 'system',
				content:
					'You are a professional content writer specialising in the insurance field. Your purpose is to write high-quality content which ranks highly in SEO results as per the core practices suggested by Google. All your response should be no more than 50 words',
				separator: '',
				optionsMessage: '',
				options: [],
			},
			{
				role: 'user',
				content:
					"Rewrite this blog based on the example blog below within the =======. Your response should be no more than 50 words. The purpose of this rewrite is to capture the tone and language of the example blog and incorporate it into the blog.\n\n=======\nCheck out our checklist and tips for moving home\nSo, you’re moving house. Congratulations! An exciting new beginning is ahead of you – and now it’s time to get organised and settle into your new home. If you’re not sure where to begin and are feeling a bit stressed, don’t panic.\n\nThere are lots of things to do when moving house, so our checklist is sure to come in handy. We’ve also got some tried and tested tips for moving house to make sure you’re covered from start to finish.\n\n\nIt's time to pack up your home\nFirst, declutter\nMoving house can feel hectic but it can also be a good opportunity to start afresh. Our top moving house tip is to start as early as possible with a ruthless clear out. Struggling to let go of things? Ask yourself whether you’ve used the item in the last year and if the answer’s no, it’s definitely time to get rid of it. If you’re upgrading your furniture, then why not donate it to a local charity shop?\n\n\nWhere can I find boxes for moving house?\nSave some cash and get packing boxes from your local supermarket. Most supermarkets will happily give used cardboard boxes and packaging to you for free. Choose boxes used for transporting fruit or alcohol, as long as there haven’t been any spillages, as these tend to be the strongest.\n\nBe sure to pick up some packing tape, scissors and Sharpies while you’re there, too. Keep an eye on local social media groups, as people are often giving moving boxes away for free.\n\n\nUse colour coding\nOne of the best moving house hacks is to assign a colour to each of your rooms and mark your packed boxes with the corresponding colour. That way, you can put your boxes straight into the room they’re supposed to be in. No more getting confused by messy handwriting or mysterious boxes with nothing written on them.",
				separator: '',
				optionsMessage: '',
				options: [],
			},
			{
				role: 'user',
				content:
					'Now I want you to rewrite the blog based on a target audiences which are listed below =======. Your response should be no more than 50 words',
				separator: '=======',
				optionsMessage: 'What is the target audience for this blog?',
				options: [
					{
						label: 'Over 50s Females',
						option: 'over 50 years old, having a high income over £35,000 p.a. and of a female gender.  ',
						optionDescription:
							'over 50s women generally have a higher amount of disposable income and are more likely to be homeowners. They are also more likely to be looking for insurance products such as home insurance.',
					},
					{
						label: 'Over 60s Females',
						option: 'over 60 years old, having a high income over £35,000 p.a. and of a female gender.  ',
						optionDescription:
							'over 60s women generally have a higher amount of disposable income and are more likely to be homeowners. They are also more likely to be looking for insurance products such as home insurance.',
					},
					{
						label: 'Over 70s Females',
						option: 'over 70 years old, having a high income over £35,000 p',
						optionDescription:
							'Women over 70 generally have a higher amount of disposable income and are more likely to be homeowners. They are also more likely to be looking for insurance products such as home insurance.',
					},
				],
			},
		];

		async function generateContent() {
			for (const prompt of promptsJson) {
				if (prompt.role === 'system' || prompt.role === 'user') {
					messages.push({
						role: prompt.role,
						content: prompt.content,
					});

					setUiState((prevPrompts) => [...prevPrompts, prompt]);

					if (prompt.options.length === 0) {
						await fetchDataAndSetState();
					}
				}
			}
			console.log(messages);
		}
		generateContent();
	}, []);

	async function fetchDataAndSetState() {
		const response = await fetch(
			'https://api.openai.com/v1/chat/completions',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer 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`,
				},
				body: JSON.stringify({
					model: 'gpt-4',
					messages,
					temperature: 1,
					max_tokens: 2216,
					top_p: 1,
					frequency_penalty: 0,
					presence_penalty: 0,
				}),
			}
		);

		const data = await response.json();

		messages.push({
			role: 'assistant',
			content: data.choices[0].message.content,
		});

		setUiState((prevPrompts) => [
			...prevPrompts,
			{
				role: 'assistant',
				content: data.choices[0].message.content,
			},
		]);
	}

	const handleCheckboxChange = (event) => {
		if (event.target.checked) {
			setSelectedOptions([...selectedOptions, event.target.value]);
		} else {
			setSelectedOptions(
				selectedOptions.filter(
					(option) => option !== event.target.value
				)
			);
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		fetchDataAndSetState();
	};

	return (
		<div>
			{uiState.map((prompt, index) => (
				<form onSubmit={handleSubmit} key={index}>
					<h2>
						{prompt.role === 'assistant' ? 'AI Response' : 'User'}
					</h2>
					<p>{prompt.content}</p>
					{prompt.role === 'user' &&
						prompt.options &&
						prompt.options.length > 0 && (
							<div>
								{prompt.options.map((option, i) => (
									<div key={i}>
										<label>
											<input
												type="checkbox"
												id={`option${i}`}
												name={`option${i}`}
												value={option.option}
												onChange={handleCheckboxChange}
											/>
											{option.label}
										</label>
									</div>
								))}
								<button type="submit">Submit</button>
							</div>
						)}
				</form>
			))}
		</div>
	);
}

export default App;
