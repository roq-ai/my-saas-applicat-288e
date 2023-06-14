import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getEmailPluginSettingById, updateEmailPluginSettingById } from 'apiSdk/email-plugin-settings';
import { Error } from 'components/error';
import { emailPluginSettingValidationSchema } from 'validationSchema/email-plugin-settings';
import { EmailPluginSettingInterface } from 'interfaces/email-plugin-setting';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function EmailPluginSettingEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<EmailPluginSettingInterface>(
    () => (id ? `/email-plugin-settings/${id}` : null),
    () => getEmailPluginSettingById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: EmailPluginSettingInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateEmailPluginSettingById(id, values);
      mutate(updated);
      resetForm();
      router.push('/email-plugin-settings');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<EmailPluginSettingInterface>({
    initialValues: data,
    validationSchema: emailPluginSettingValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Email Plugin Setting
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="setting_key" mb="4" isInvalid={!!formik.errors?.setting_key}>
              <FormLabel>Setting Key</FormLabel>
              <Input type="text" name="setting_key" value={formik.values?.setting_key} onChange={formik.handleChange} />
              {formik.errors.setting_key && <FormErrorMessage>{formik.errors?.setting_key}</FormErrorMessage>}
            </FormControl>
            <FormControl id="setting_value" mb="4" isInvalid={!!formik.errors?.setting_value}>
              <FormLabel>Setting Value</FormLabel>
              <Input
                type="text"
                name="setting_value"
                value={formik.values?.setting_value}
                onChange={formik.handleChange}
              />
              {formik.errors.setting_value && <FormErrorMessage>{formik.errors?.setting_value}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'email_plugin_setting',
  operation: AccessOperationEnum.UPDATE,
})(EmailPluginSettingEditPage);
