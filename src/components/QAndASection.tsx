interface QAItem {
  question: string;
  answer: string;
}

interface QAndASectionProps {
  isActive: boolean;
}

export const QAndASection = ({ isActive }: QAndASectionProps) => {
  if (!isActive) return null;

  const qas: QAItem[] = [
    {
      question: "What should I wear?",
      answer: "Semi-formal attire is requested."
    },
    {
      question: "Will the ceremony be indoors or outdoors?",
      answer: "The ceremony will be held indoors at The Gathering Church."
    },
    {
      question: "Is there parking available?",
      answer: "Yes, parking is available at both the ceremony and reception venues."
    }
  ];
  
  return (
    <section id="q-and-a" className="text-center my-14">
      <h2 className="text-3xl tracking-wider mb-8 font-['Cormorant_Garamond']">
        Q + A
      </h2>
      
      <div className="max-w-2xl mx-auto">
        {qas.map((qa, index) => (
          <div 
            key={index} 
            className="max-w-[700px] mx-auto mb-8 text-left border-b border-gray-100 pb-4 last:border-0"
          >
            <h3 className="mb-2.5 text-xl font-['Cormorant_Garamond']">
              {qa.question}
            </h3>
            <p>{qa.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QAndASection;
