import dynamic from 'next/dynamic'

const DecisionWizard = dynamic(() => import('../components/DecisionWizard'), {
  ssr: false,
  loading: () => null,
})

export default function Page() {
  return <DecisionWizard />
}
