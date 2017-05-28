<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use AppBundle\Entity\Mosque;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Vich\UploaderBundle\Form\Type\VichImageType;
use AppBundle\Entity\User;
use Symfony\Component\Security\Core\Authorization\AuthorizationChecker;

class MosqueType extends AbstractType {

    /**
     *
     * @var AuthorizationChecker 
     */
    private $securityChecker;

    public function __construct(AuthorizationChecker $securityChecker) {
        $this->securityChecker = $securityChecker;
    }

    public function buildForm(FormBuilderInterface $builder, array $options) {

        if ( $builder->getData()->getUser() instanceof User
                && $this->securityChecker->isGranted('ROLE_ADMIN')) {
            $builder
                    ->add('user', EntityType::class, [
                        'label' => 'user',
                        'choice_label' => 'username',
                        'required' => true,
                        'empty_data' => null,
                        'class' => User::class,
            ]);
        }

        $builder
                ->add('name', null, [
                    'label' => 'mosque.name',
                    'required' => true,
                    'attr' => [
                        'placeholder' => 'mosque.form.name.placeholder',
                    ]
                ])
                ->add('associationName', null, [
                    'label' => 'association_name',
                ])
                ->add('phone', null, [
                    'label' => 'phone',
                    'required' => true,
                ])
                ->add('email', EmailType::class, [
                    'label' => 'email',
                    'required' => true,
                ])
                ->add('address', null, [
                    'label' => 'address',
                ])
                ->add('city', null, [
                    'label' => 'city',
                    'required' => true,
                    'attr' => [
                        'placeholder' => 'mosque.form.city.placeholder',
                    ]
                ])
                ->add('zipcode', null, [
                    'label' => 'zipcode',
                    'required' => true,
                    'attr' => [
                        'placeholder' => 'mosque.form.zipcode.placeholder',
                    ]
                ])
                ->add('country', null, [
                    'label' => 'country',
                    'attr' => [
                        'class' => 'form-control',
                    ]
                ])
                ->add('rib', null, [
                    'label' => 'rib',
                    'attr' => [
                        'placeholder' => 'mosque.form.rib.placeholder',
                    ]
                ])
                ->add('file1', VichImageType::class, [
                    'required' => false,
                    'download_link' => false,
                    'label' => 'mosque.form.image1.label',
                    'attr' => [
                        'class' => 'form-control',
                    ]
                ])
                ->add('file2', VichImageType::class, [
                    'label' => 'mosque.form.image2.label',
                    'download_link' => false,
                    'required' => false,
                    'attr' => [
                        'class' => 'form-control',
                    ]
                ])
                ->add('file3', VichImageType::class, [
                    'required' => false,
                    'download_link' => false,
                    'label' => 'mosque.form.image3.label',
                    'attr' => [
                        'class' => 'form-control',
                    ]
                ])
                ->add('save', SubmitType::class, [
                    'label' => 'save',
                    'attr' => [
                        'class' => 'btn btn-primary',
                    ]
                ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver) {
        $resolver->setDefaults(array(
            'data_class' => Mosque::class
        ));
    }

}
